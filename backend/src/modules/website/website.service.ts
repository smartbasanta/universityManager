import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindManyOptions, FindOptionsOrder, Repository } from 'typeorm';
import { UniversityEntity } from 'src/model/university.entity';
import { ResearchNewsEntity } from 'src/model/research_news.entity';
import { ScholarshipEntity } from 'src/model/scholarship.entity';
import { JobEntity, JobStatus } from 'src/model/job.entity';
import { OpportunityEntity, OpportunityStatus } from 'src/model/opportunity.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { NewsStatus } from 'src/helper/types/index.type';
import { PersonStatus, UserStatus } from 'src/helper/enums/user-status.enum';

@Injectable()
export class WebsiteService {
  constructor(
    @InjectRepository(UniversityEntity) private readonly universityRepo: Repository<UniversityEntity>,
    @InjectRepository(ResearchNewsEntity) private readonly newsRepo: Repository<ResearchNewsEntity>,
    @InjectRepository(ScholarshipEntity) private readonly scholarshipRepo: Repository<ScholarshipEntity>,
    @InjectRepository(JobEntity) private readonly jobRepo: Repository<JobEntity>,
    @InjectRepository(OpportunityEntity) private readonly opportunityRepo: Repository<OpportunityEntity>,
    @InjectRepository(StudentAmbassadorEntity) private readonly ambassadorRepo: Repository<StudentAmbassadorEntity>,
    @InjectRepository(MentorInResidenceEntity) private readonly mentorRepo: Repository<MentorInResidenceEntity>,
  ) {}

  private getFindOptions<T>(limit: number = 6): FindManyOptions<T> {
    return {
      take: limit,
      order: { createdAt: 'DESC' } as unknown as FindOptionsOrder<T>,
    };
  }

  async findFeaturedUniversities(limit: number) {
    return this.universityRepo.find({ ...this.getFindOptions(limit), relations: ['overview'] });
  }

  async findFeaturedNews(limit: number) {
    return this.newsRepo.find({ where: { status: NewsStatus.PUBLISHED }, ...this.getFindOptions(limit) });
  }

  async findLiveScholarships(limit: number) {
    return this.scholarshipRepo.find({ ...this.getFindOptions(limit), relations: ['university'] });
  }

  async findLiveJobs(limit: number) {
    return this.jobRepo.find({ where: { status: JobStatus.LIVE }, ...this.getFindOptions(limit), relations: ['institution', 'university'] });
  }

  async findLiveOpportunities(limit: number) {
    return this.opportunityRepo.find({ where: { status: OpportunityStatus.LIVE }, ...this.getFindOptions(limit), relations: ['university'] });
  }

  async findActiveAmbassadors(limit: number) {
    return this.ambassadorRepo.find({ where: { status: UserStatus.ACTIVE }, ...this.getFindOptions(limit), relations: ['university', 'department'] });
  }

  async findActiveMentors(limit: number) {
    return this.mentorRepo.find({ where: { status: PersonStatus.ACTIVE }, ...this.getFindOptions(limit), relations: ['university'] });
  }
}