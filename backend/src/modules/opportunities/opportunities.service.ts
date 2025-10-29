import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { JobEntity } from 'src/model/job.entity';
import { ScholarshipEntity } from 'src/model/scholarship.entity';
import { OpportunityEntity } from 'src/model/opportunity.entity';
import { CreateJobDto, UpdateJobDto, CreateScholarshipDto, UpdateScholarshipDto, CreateOpportunityDto, UpdateOpportunityDto } from './dto/opportunities.dto';
import { UniversityEntity } from 'src/model/university.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { AuthEntity } from 'src/model/auth.entity';
import { JobQuestionEntity } from 'src/model/job_question.entity';
import { ScholarshipQuestionEntity } from 'src/model/scholarship_question.entity';
import { PermissionService, ScopeFilteringConfig } from '../access-control/permission/permission.service';

@Injectable()
export class OpportunitiesService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(JobEntity) private readonly jobRepo: Repository<JobEntity>,
    @InjectRepository(ScholarshipEntity) private readonly scholarshipRepo: Repository<ScholarshipEntity>,
    @InjectRepository(OpportunityEntity) private readonly opportunityRepo: Repository<OpportunityEntity>,
    private readonly permissionService: PermissionService,
  ) {}

  private async findAuthUser(manager: EntityManager, userId: string): Promise<AuthEntity> {
      const user = await manager.findOneBy(AuthEntity, { id: userId });
      if (!user) throw new NotFoundException('Authenticated user not found.');
      return user;
  }

  // --- JOB METHODS ---
  async createJob(dto: CreateJobDto, userId: string): Promise<JobEntity> {
    return this.dataSource.transaction(async manager => {
      try {
        const authUser = await this.findAuthUser(manager, userId);
        const job = manager.create(JobEntity, { ...dto, auth: authUser, questions: [] });

        if (dto.universityId) job.university = await manager.findOneByOrFail(UniversityEntity, { id: dto.universityId });
        else if (dto.institutionId) job.institution = await manager.findOneByOrFail(InstitutionEntity, { id: dto.institutionId });
        else if (dto.departmentId) job.department = await manager.findOneByOrFail(DepartmentEntity, { id: dto.departmentId });
        else throw new BadRequestException('A job must be scoped to a university, institution, or department.');

        if (dto.hasApplicationForm && dto.questions) {
          job.questions = dto.questions.map(q => manager.create(JobQuestionEntity, q));
        }

        return manager.save(job);
      } catch (err) {
        throw new InternalServerErrorException(`Failed to create job: ${err.message}`);
      }
    });
  }

  async updateJob(id: string, dto: UpdateJobDto): Promise<JobEntity> {
      const job = await this.jobRepo.findOneBy({ id });
      if (!job) throw new NotFoundException('Job not found.');
      const updatedJob = this.jobRepo.merge(job, dto);
      return this.jobRepo.save(updatedJob);
  }
  //has to be modified
  async findAllJobs(user: AuthEntity): Promise<JobEntity[]> {
    const qb = this.jobRepo.createQueryBuilder('job');

    const scopeConfig: ScopeFilteringConfig = {
      university: 'universityId',
      institution: 'institutionId',
      department: 'departmentId',
    };
    
    await this.permissionService.applyPermissionScope(qb, user.id, scopeConfig);
    
    return qb.getMany();
  }

  async findJobById(id: string): Promise<JobEntity> {
      const job = await this.jobRepo.findOneBy({ id });
      if (!job) throw new NotFoundException('Job not found.');
      return job;
  }

  async removeJob(id: string): Promise<{ message: string }> {
      const result = await this.jobRepo.softDelete(id);
      if (result.affected === 0) throw new NotFoundException('Job not found.');
      return { message: 'Job moved to trash successfully.' };
  }

  // --- SCHOLARSHIP METHODS ---
  async createScholarship(dto: CreateScholarshipDto, userId: string): Promise<ScholarshipEntity> {
    return this.dataSource.transaction(async manager => {
      try {
        const authUser = await this.findAuthUser(manager, userId);
        const scholarship = manager.create(ScholarshipEntity, { ...dto, auth: authUser, questions: [] });

        if (dto.universityId) scholarship.university = await manager.findOneByOrFail(UniversityEntity, { id: dto.universityId });
        else if (dto.institutionId) scholarship.institution = await manager.findOneByOrFail(InstitutionEntity, { id: dto.institutionId });
        else if (dto.departmentId) scholarship.department = await manager.findOneByOrFail(DepartmentEntity, { id: dto.departmentId });
        else throw new BadRequestException('A scholarship must be scoped to a university, institution, or department.');

        if (dto.questions) {
            scholarship.questions = dto.questions.map(q => manager.create(ScholarshipQuestionEntity, q));
        }
        
        return manager.save(scholarship);
      } catch (err) {
        throw new InternalServerErrorException(`Failed to create scholarship: ${err.message}`);
      }
    });
  }

  async updateScholarship(id: string, dto: UpdateScholarshipDto): Promise<ScholarshipEntity> {
      const scholarship = await this.scholarshipRepo.findOneBy({ id });
      if (!scholarship) throw new NotFoundException('Scholarship not found.');
      const updatedScholarship = this.scholarshipRepo.merge(scholarship, dto);
      return this.scholarshipRepo.save(updatedScholarship);
  }

  async findScholarshipById(id: string): Promise<ScholarshipEntity> {
      const scholarship = await this.scholarshipRepo.findOneBy({ id });
      if (!scholarship) throw new NotFoundException('Scholarship not found.');
      return scholarship;
  }
  //this also needs modification
  async findAllScholarships(user: AuthEntity): Promise<ScholarshipEntity[]> {
    const qb = this.scholarshipRepo.createQueryBuilder('scholarship');
    
    const scopeConfig: ScopeFilteringConfig = {
      university: 'universityId',
      institution: 'institutionId',
      department: 'departmentId',
    };

    await this.permissionService.applyPermissionScope(qb, user.id, scopeConfig);
    
    return qb.getMany();
  }

  async removeScholarship(id: string): Promise<{ message: string }> {
      const result = await this.scholarshipRepo.softDelete(id);
      if (result.affected === 0) throw new NotFoundException('Scholarship not found.');
      return { message: 'Scholarship moved to trash successfully.' };
  }

  // --- OPPORTUNITY METHODS ---
  async createOpportunity(dto: CreateOpportunityDto, userId: string): Promise<OpportunityEntity> {
    return this.dataSource.transaction(async manager => {
        try {
            const authUser = await this.findAuthUser(manager, userId);
            const opportunity = manager.create(OpportunityEntity, { ...dto, auth: authUser });
            
            if (dto.scope === 'university' && dto.universityId) opportunity.university = await manager.findOneByOrFail(UniversityEntity, { id: dto.universityId });
            else if (dto.scope === 'institution' && dto.institutionId) opportunity.institution = await manager.findOneByOrFail(InstitutionEntity, { id: dto.institutionId });
            else if (dto.scope === 'department' && dto.departmentId) opportunity.department = await manager.findOneByOrFail(DepartmentEntity, { id: dto.departmentId });
            else throw new BadRequestException('Opportunity scope and ID mismatch or not provided.');

            return manager.save(opportunity);
        } catch (err) {
            throw new InternalServerErrorException(`Failed to create opportunity: ${err.message}`);
        }
    });
  }

  async updateOpportunity(id: string, dto: UpdateOpportunityDto): Promise<OpportunityEntity> {
      const opportunity = await this.opportunityRepo.findOneBy({ id });
      if (!opportunity) throw new NotFoundException('Opportunity not found.');
      const updatedOpportunity = this.opportunityRepo.merge(opportunity, dto);
      return this.opportunityRepo.save(updatedOpportunity);
  }

  async findOpportunityById(id: string): Promise<OpportunityEntity> {
      const opportunity = await this.opportunityRepo.findOneBy({ id });
      if (!opportunity) throw new NotFoundException('Opportunity not found.');
      return opportunity;
  }

  //this also needs modification
  async findAllOpportunities(user: AuthEntity): Promise<OpportunityEntity[]> {
    const qb = this.opportunityRepo.createQueryBuilder('opportunity');
    
    const scopeConfig: ScopeFilteringConfig = {
      university: 'universityId',
      institution: 'institutionId',
      department: 'departmentId',
    };
    
    await this.permissionService.applyPermissionScope(qb, user.id, scopeConfig);
    
    return qb.getMany();
  }

  async removeOpportunity(id: string): Promise<{ message: string }> {
      const result = await this.opportunityRepo.softDelete(id);
      if (result.affected === 0) throw new NotFoundException('Opportunity not found.');
      return { message: 'Opportunity moved to trash successfully.' };
  }
}
