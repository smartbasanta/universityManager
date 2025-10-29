import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedController } from './seed.controller';
import { SeedService } from './seed.service';

// Import ALL your current entities here
import { AuthEntity } from 'src/model/auth.entity';
import { BookingEntity } from 'src/model/booking.entity';
import { CareerOutcomesEntity } from 'src/model/career_outcomes.entity';
import { CommentEntity } from 'src/model/comment.entity';
import { CourseEntity } from 'src/model/course.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { EntrepreneurshipEntity } from 'src/model/entrepreneurship.entity';
import { FacultyEntity } from 'src/model/faculty.entity';
import { HackathonEntity } from 'src/model/hackathon.entity';
import { HostedEventEntity } from 'src/model/hosted_event.entity';
import { HousingEntity } from 'src/model/housing.entity';
import { IncubatorEntity } from 'src/model/incubator.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { JobAnswerEntity } from 'src/model/job_answer.entity';
import { JobQuestionEntity } from 'src/model/job_question.entity';
import { JobEntity } from 'src/model/job.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { NotableAlumniEntity } from 'src/model/notable_alumni.entity';
import { OpportunityQuestionEntity } from 'src/model/opportunity_question.entity';
import { OpportunityTeamMemberQuestionEntity } from 'src/model/opportunity_team_member_questions.entity';
import { OpportunityEntity } from 'src/model/opportunity.entity';
import { PermissionEntity } from 'src/model/permission.entity';
import { ProgramOutcomeEntity } from 'src/model/program_outcome.entity';
import { ProgramEntity } from 'src/model/program.entity';
import { ResearchHubEntity } from 'src/model/research_hub.entity';
import { ResearchNewsEntity } from 'src/model/research_news.entity';
import { ReviewEntity } from 'src/model/review.entity';
import { RevokedPermissionEntity } from 'src/model/revoked_permission.entity';
import { RoleEntity } from 'src/model/role.entity';
import { RoomOptionEntity } from 'src/model/room_option.entity';
import { ScholarshipAnswerEntity } from 'src/model/scholarship_answer.entity';
import { ScholarshipQuestionEntity } from 'src/model/scholarship_question.entity';
import { ScholarshipEntity } from 'src/model/scholarship.entity';
import { SlotEntity } from 'src/model/slot.entity';
import { SportsFacilityEntity } from 'src/model/sports_facility.entity';
import { SportsTeamEntity } from 'src/model/sports_team.entity';
import { StaffEntity } from 'src/model/staff.entity';
import { StartupStoryEntity } from 'src/model/startup_story.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { StudentOpportunityAnswerEntity } from 'src/model/student_opportunity_answer.entity';
import { StudentOrganizationEntity } from 'src/model/student_organization.entity';
import { StudentEntity } from 'src/model/student.entity';
import { TeamAchievementEntity } from 'src/model/team_achievement.entity';
import { TopEmployerEntity } from 'src/model/top_employer.entity';
import { UniversityAdmissionRequirementEntity } from 'src/model/university_admission_requirement.entity';
import { UniversityAdmissionEntity } from 'src/model/university_admission.entity';
import { UniversityOverviewEntity } from 'src/model/university_overview.entity';
import { UniversityRankingEntity } from 'src/model/university_ranking.entity';
import { UniversitySportsEntity } from 'src/model/university_sports.entity';
import { UniversityStudentLifeEntity } from 'src/model/university_student_life.entity';
import { UniversityTraditionEntity } from 'src/model/university_tradition.entity';
import { UniversityTuitionEntity } from 'src/model/university_tuition.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { UserDirectPermissionEntity } from 'src/model/user_direct_permission.entity';
import { UserRoleAssignmentEntity } from 'src/model/user_role_assignment.entity';
import { CountryEntity } from 'src/model/country.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Add all entities here
      AuthEntity, BookingEntity, CareerOutcomesEntity, CommentEntity, CourseEntity,
      DepartmentEntity, EntrepreneurshipEntity, FacultyEntity, HackathonEntity,
      HostedEventEntity, HousingEntity, IncubatorEntity, InstitutionEntity,
      JobAnswerEntity, JobQuestionEntity, JobEntity, MentorInResidenceEntity,
      NotableAlumniEntity, OpportunityQuestionEntity, OpportunityTeamMemberQuestionEntity,
      OpportunityEntity, PermissionEntity, ProgramOutcomeEntity, ProgramEntity,
      ResearchHubEntity, ResearchNewsEntity, ReviewEntity, RevokedPermissionEntity,
      RoleEntity, RoomOptionEntity, ScholarshipAnswerEntity, ScholarshipQuestionEntity,
      ScholarshipEntity, SlotEntity, SportsFacilityEntity, SportsTeamEntity, StaffEntity,
      StartupStoryEntity, StudentAmbassadorEntity, StudentOpportunityAnswerEntity,
      StudentOrganizationEntity, StudentEntity, TeamAchievementEntity, TopEmployerEntity,
      UniversityAdmissionRequirementEntity, UniversityAdmissionEntity, UniversityOverviewEntity,
      UniversityRankingEntity, UniversitySportsEntity, UniversityStudentLifeEntity,
      UniversityTraditionEntity, UniversityTuitionEntity, UniversityEntity,
      UserDirectPermissionEntity, UserRoleAssignmentEntity, CountryEntity
    ]),
  ],
  controllers: [SeedController],
  providers: [SeedService],
})
export class SeedModule {}