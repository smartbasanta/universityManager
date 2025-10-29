import { forwardRef, Module } from '@nestjs/common';
import { UniversityService } from './university.service';
import { UniversityController } from './university.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UniversityEntity } from 'src/model/university.entity';
import { UniversityOverviewEntity } from 'src/model/university_overview.entity';
import { UniversityAdmissionEntity } from 'src/model/university_admission.entity';
import { UniversityAdmissionRequirementEntity } from 'src/model/university_admission_requirement.entity';
import { UniversityTuitionEntity } from 'src/model/university_tuition.entity';
import { UniversityRankingEntity } from 'src/model/university_ranking.entity';
import { UniversityStudentLifeEntity } from 'src/model/university_student_life.entity';
import { UniversitySportsEntity } from 'src/model/university_sports.entity';
import { UniversityProfileService } from './university-profile.service';
import { UniversityProfileController } from './university-profile.controller';
import { CareerOutcomesEntity } from 'src/model/career_outcomes.entity';
import { NotableAlumniEntity } from 'src/model/notable_alumni.entity';
import { ResearchHubEntity } from 'src/model/research_hub.entity';
import { TopEmployerEntity } from 'src/model/top_employer.entity';
import { HousingEntity } from 'src/model/housing.entity';
import { EntrepreneurshipEntity } from 'src/model/entrepreneurship.entity';


import { AuthModule } from '../auth/auth.module';
import { PermissionModule } from '../access-control/permission/permission.module';
import { AuthEntity } from 'src/model/auth.entity';
import { UniversityWebsiteController } from './university-website.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthEntity,
      UniversityEntity,
      UniversityOverviewEntity,
      UniversityAdmissionEntity,
      UniversityAdmissionRequirementEntity,
      UniversityTuitionEntity,
      UniversityRankingEntity,
      UniversityStudentLifeEntity,
      UniversitySportsEntity,
      CareerOutcomesEntity, 
      NotableAlumniEntity, 
      ResearchHubEntity, 
      TopEmployerEntity, 
      HousingEntity, 
      EntrepreneurshipEntity,
    ]),
    forwardRef(() => AuthModule), // Use forwardRef here as well
    PermissionModule,
  ],
  controllers: [UniversityController, UniversityProfileController, UniversityWebsiteController],
  providers: [UniversityService, UniversityProfileService],
  exports: [UniversityService, UniversityProfileService],
})
export class UniversityModule {}