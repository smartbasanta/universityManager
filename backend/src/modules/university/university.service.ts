import { Injectable, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, DataSource, Repository } from 'typeorm';
import { UniversityEntity } from 'src/model/university.entity';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { PermissionService, ScopeFilteringConfig } from '../access-control/permission/permission.service';
import { AuthEntity } from 'src/model/auth.entity';
import { AuthService } from '../auth/auth.service';
import { UserType } from 'src/helper/enums/user-type.enum';
import { UniversityOverviewEntity } from 'src/model/university_overview.entity';
import { UniversityAdmissionEntity } from 'src/model/university_admission.entity';
import { UniversityTuitionEntity } from 'src/model/university_tuition.entity';
import { UniversityRankingEntity } from 'src/model/university_ranking.entity';
import { UniversityStudentLifeEntity } from 'src/model/university_student_life.entity';
import { UniversitySportsEntity } from 'src/model/university_sports.entity';

export interface UniversityWebsiteQueryParams {
  search?: string;
  country?: string;
  area_type?: string; // Corresponds to 'locations' filter
  type?: string;      // Corresponds to 'types' filter
}

@Injectable()
export class UniversityService {
  constructor(
    @InjectRepository(UniversityEntity)
    private readonly universityRepository: Repository<UniversityEntity>,
    private readonly permissionService: PermissionService,
    private readonly authService: AuthService,
    private readonly dataSource: DataSource,
  ) {}

  /**
   * Creates a new university profile with all its related entities in a single transaction.
   */
  async create(createDto: CreateUniversityDto, user: { sub: string }): Promise<UniversityEntity> {
    const authUser = await this.dataSource.getRepository(AuthEntity).findOneBy({ id: user.sub });
    if (!authUser) throw new NotFoundException('Authenticated user not found.');

    if (await this.universityRepository.findOneBy({ university_name: createDto.university_name })) {
      throw new ConflictException('A university with this name already exists.');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Create the University entity instance
      const newUniversity = new UniversityEntity();
      newUniversity.university_name = createDto.university_name;
      newUniversity.about = createDto.about;
      newUniversity.mission_statement = createDto.mission_statement;
      newUniversity.website = createDto.website;
      newUniversity.auth = authUser; // Link to the creator's Auth record

      // 2. Create and associate all related entities
      const overview = queryRunner.manager.create(UniversityOverviewEntity, createDto.overview);
      newUniversity.overview = await queryRunner.manager.save(overview);
      
      // Create blank student life & sports entities
      newUniversity.student_life = await queryRunner.manager.save(queryRunner.manager.create(UniversityStudentLifeEntity));
      newUniversity.sports = await queryRunner.manager.save(queryRunner.manager.create(UniversitySportsEntity));

      const savedUniversity = await queryRunner.manager.save(newUniversity);

      // 3. Create OneToMany related entities and link them back
      if (createDto.admissions) {
        const admissions = createDto.admissions.map(dto => 
            queryRunner.manager.create(UniversityAdmissionEntity, { ...dto, university: savedUniversity })
        );
        await queryRunner.manager.save(admissions);
      }

      if (createDto.tuition_fees) {
        const tuitions = createDto.tuition_fees.map(dto => 
            queryRunner.manager.create(UniversityTuitionEntity, { ...dto, university: savedUniversity })
        );
        await queryRunner.manager.save(tuitions);
      }

      if (createDto.rankings) {
        const rankings = createDto.rankings.map(dto => 
            queryRunner.manager.create(UniversityRankingEntity, { ...dto, university: savedUniversity })
        );
        await queryRunner.manager.save(rankings);
      }

      // 4. Assign the default admin role for this new university
      await this.authService.assignDefaultRole(
        authUser.id, 
        UserType.UNIVERSITY_ADMIN, 
        { universityId: savedUniversity.id }
      );
      
      await queryRunner.commitTransaction();
      return this.findOne(savedUniversity.id); // Re-fetch to get all relations

    } catch (err) {
      await queryRunner.rollbackTransaction();
      throw new InternalServerErrorException(`Failed to create university: ${err.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  /**
   * Finds all universities the user has permission to view.
   */
  async findAll(user: { sub: string }): Promise<UniversityEntity[]> {
    const qb = this.universityRepository.createQueryBuilder('university');
    
    const scopeConfig: ScopeFilteringConfig = {
      university: 'id', // A university scope checks the university's own ID
    };

    // Apply permission scopes to the query
    await this.permissionService.applyPermissionScope(qb, user.sub, scopeConfig);

    return qb.leftJoinAndSelect('university.overview', 'overview').getMany();
  }

  /**
   * Finds a single university by ID, including all its profile relations.
   */
  async findOne(id: string): Promise<UniversityEntity> {
    const university = await this.universityRepository.findOne({
      where: { id },
      relations: [
        'overview', 'admissions', 'admissions.requirements', 'tuition_fees', 'rankings', 'student_life', 'sports'
      ],
    });
    if (!university) {
      throw new NotFoundException(`University with ID "${id}" not found.`);
    }
    return university;
  }

  async getBasicInfo(id: string) {
    const university = await this.universityRepository.findOne({
        where: { id, is_published: true }, // Ensure only published universities are visible
        relations: ['overview'],
    });
    if (!university) throw new NotFoundException('University not found or not published.');
    return university;
  }

  async getGeneralSections(id: string) {
    const university = await this.universityRepository.findOne({
        where: { id },
        relations: [
            'student_life', 'student_life.organizations', 'student_life.traditions',
            'sports', 'sports.teams', 'sports.facilities',
            'notable_alumni',
            'research_hubs',
            'reviews', 'reviews.student'
        ]
    });
    if (!university) throw new NotFoundException('University not found.');
    return university;
  }


  async getUndergraduateSection(id: string) {
      const university = await this.universityRepository.findOne({
          where: { id },
          relations: [
              'rankings',
              'departments', 'departments.programs',
              'admissions', 'admissions.requirements',
              'tuition_fees'
          ]
      });
      if (!university) throw new NotFoundException('University not found.');
      return university;
  }

  // --- GRADUATE TAB SECTION ---
  async getGraduateSection(id: string) {
    // This can often be the same query as undergraduate, with frontend filtering,
    // or you can add specific graduate relations later.
    const university = await this.universityRepository.findOne({
        where: { id },
        relations: [
            'rankings',
            'departments', 'departments.programs',
            'admissions', 'admissions.requirements',
            'tuition_fees'
        ]
    });
    if (!university) throw new NotFoundException('University not found.');
    return university;
  }
  
  /**
   * Updates a university's profile.
   * This is a complex operation and should also be transactional.
   */
  async update(id: string, updateDto: UpdateUniversityDto): Promise<UniversityEntity> {
    // For simplicity, we are showing a basic update. A real-world scenario would require a
    // transaction similar to the create method to handle updates of nested arrays (admissions, etc.).
    const university = await this.findOne(id); // leverages existing findOne logic
    
    // Merge and save top-level properties
    const updatedUniversity = this.universityRepository.merge(university, {
        university_name: updateDto.university_name,
        about: updateDto.about,
        mission_statement: updateDto.mission_statement,
        website: updateDto.website,
    });
    
    // Update OneToOne relation if provided
    if (updateDto.overview) {
        const overviewRepo = this.dataSource.getRepository(UniversityOverviewEntity);
        updatedUniversity.overview = await overviewRepo.save({
            ...university.overview,
            ...updateDto.overview
        });
    }

    await this.universityRepository.save(updatedUniversity);
    return this.findOne(id);
  }

  /**
   * Deletes a university.
   */
  async remove(id: string): Promise<{ message: string }> {
    const university = await this.findOne(id);
    await this.universityRepository.remove(university);
    return { message: `University "${university.university_name}" deleted successfully.` };
  }


  async findForWebsite(params: UniversityWebsiteQueryParams): Promise<UniversityEntity[]> {
    const qb = this.universityRepository.createQueryBuilder('university')
      .leftJoinAndSelect('university.overview', 'overview');

    // --- Search Logic ---
    if (params.search) {
      const searchTerm = `%${params.search}%`;
      qb.andWhere(new Brackets(sqb => {
        sqb.where('university.university_name ILIKE :search', { search: searchTerm })
           .orWhere('overview.country ILIKE :search', { search: searchTerm })
           .orWhere('overview.city ILIKE :search', { search: searchTerm });
      }));
    }

    // --- Filter Logic ---
    if (params.country) {
      qb.andWhere('overview.country IN (:...countries)', { countries: params.country.split(',') });
    }
    if (params.area_type) {
      qb.andWhere('overview.campus_setting IN (:...area_types)', { area_types: params.area_type.split(',') });
    }
    if (params.type) {
      qb.andWhere('overview.university_type IN (:...types)', { types: params.type.split(',') });
    }

    return qb.orderBy('university.university_name', 'ASC').getMany();
  }

  /**
   * NEW: Fetches distinct values for filter dropdowns.
   */
  async findFilterOptions(): Promise<{ countries: string[], area_types: string[], university_types: string[] }> {
      const countryQuery = this.dataSource.getRepository(UniversityOverviewEntity).createQueryBuilder("overview")
          .select("DISTINCT overview.country", "country")
          .where("overview.country IS NOT NULL")
          .orderBy("country", "ASC")
          .getRawMany();

      // For enums or fixed values, we can often return them directly
      const area_types = ['Urban', 'Suburban', 'Rural'];
      const university_types = ['Public', 'Private'];

      const countries = (await countryQuery).map(c => c.country);

      return { countries, area_types, university_types };
  }
  
}