import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OpportunitiesService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';
import { JobEntity } from 'src/model/job.entity';
import { JobQuestionEntity } from 'src/model/job_question.entity';
import { ScholarshipEntity } from 'src/model/scholarship.entity';
import { ScholarshipQuestionEntity } from 'src/model/scholarship_question.entity';
import { OpportunityEntity } from 'src/model/opportunity.entity';
import { OpportunityQuestionEntity } from 'src/model/opportunity_question.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { PermissionModule } from '../access-control/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      JobEntity, JobQuestionEntity, ScholarshipEntity, ScholarshipQuestionEntity, OpportunityEntity, OpportunityQuestionEntity,
      UniversityEntity, InstitutionEntity, DepartmentEntity,
    ]),
    PermissionModule
  ],
  controllers: [OpportunitiesController],
  providers: [OpportunitiesService],
})
export class OpportunitiesModule {}