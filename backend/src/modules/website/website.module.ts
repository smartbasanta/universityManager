import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WebsiteService } from './website.service';
import { WebsiteController } from './website.controller';
// Import all entities this module needs to read
import { UniversityEntity } from 'src/model/university.entity';
import { ResearchNewsEntity } from 'src/model/research_news.entity';
import { ScholarshipEntity } from 'src/model/scholarship.entity';
import { JobEntity } from 'src/model/job.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { OpportunityEntity } from 'src/model/opportunity.entity';
// ... import all other entities from WebsiteService constructor

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UniversityEntity, ResearchNewsEntity, ScholarshipEntity, JobEntity, 
      OpportunityEntity, StudentAmbassadorEntity, MentorInResidenceEntity
    ])
  ],
  controllers: [WebsiteController],
  providers: [WebsiteService],
})
export class WebsiteModule {}