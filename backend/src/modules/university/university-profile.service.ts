import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UniversityEntity } from 'src/model/university.entity';
import { UpdateCareerOutcomesDto, CreateNotableAlumniDto, CreateResearchHubDto } from './dto/update-university-sections.dto';
import { CareerOutcomesEntity } from 'src/model/career_outcomes.entity';
import { NotableAlumniEntity } from 'src/model/notable_alumni.entity';
import { ResearchHubEntity } from 'src/model/research_hub.entity';
import { TopEmployerEntity } from 'src/model/top_employer.entity';

@Injectable()
export class UniversityProfileService {
  constructor(
    @InjectRepository(UniversityEntity)
    private readonly universityRepository: Repository<UniversityEntity>,
    private readonly dataSource: DataSource,
  ) {}

  private async findUniversityOrFail(universityId: string): Promise<UniversityEntity> {
    const university = await this.universityRepository.findOneBy({ id: universityId });
    if (!university) throw new NotFoundException(`University with ID "${universityId}" not found.`);
    return university;
  }

  async updateCareerOutcomes(universityId: string, dto: UpdateCareerOutcomesDto): Promise<CareerOutcomesEntity> {
    return this.dataSource.transaction(async manager => {
        try {
            let careerOutcomes = await manager.findOne(CareerOutcomesEntity, { where: { university: { id: universityId } } });
            if (!careerOutcomes) {
                const university = await this.findUniversityOrFail(universityId);
                careerOutcomes = manager.create(CareerOutcomesEntity, { university });
            }

            manager.merge(CareerOutcomesEntity, careerOutcomes, dto);
            const savedOutcomes = await manager.save(careerOutcomes);

            if (dto.top_employers) {
                await manager.delete(TopEmployerEntity, { careerOutcomes: { id: savedOutcomes.id } });
                const newEmployers = dto.top_employers.map(e => manager.create(TopEmployerEntity, { ...e, careerOutcomes: savedOutcomes }));
                await manager.save(newEmployers);
            }
            return manager.findOneOrFail(CareerOutcomesEntity, { where: { id: savedOutcomes.id }, relations: ['top_employers'] });
        } catch (err) {
            throw new InternalServerErrorException(`Failed to update career outcomes: ${err.message}`);
        }
    });
  }

  async addNotableAlumni(universityId: string, dto: CreateNotableAlumniDto): Promise<NotableAlumniEntity> {
    const university = await this.findUniversityOrFail(universityId);
    const alumni = this.dataSource.getRepository(NotableAlumniEntity).create({ ...dto, university });
    return this.dataSource.getRepository(NotableAlumniEntity).save(alumni);
  }

  async removeNotableAlumni(alumniId: string): Promise<{ message: string }> {
    const result = await this.dataSource.getRepository(NotableAlumniEntity).delete(alumniId);
    if (result.affected === 0) throw new NotFoundException(`Alumni with ID "${alumniId}" not found.`);
    return { message: 'Notable alumni removed successfully.' };
  }
  
  async addResearchHub(universityId: string, dto: CreateResearchHubDto): Promise<ResearchHubEntity> {
    const university = await this.findUniversityOrFail(universityId);
    const hub = this.dataSource.getRepository(ResearchHubEntity).create({ ...dto, university });
    return this.dataSource.getRepository(ResearchHubEntity).save(hub);
  }
  
  async removeResearchHub(hubId: string): Promise<{ message: string }> {
    const result = await this.dataSource.getRepository(ResearchHubEntity).delete(hubId);
    if (result.affected === 0) throw new NotFoundException(`Research hub with ID "${hubId}" not found.`);
    return { message: 'Research hub removed successfully.' };
  }
}