import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityOverviewEntity } from './university_overview.entity';
import { DepartmentEntity } from './department.entity';
import { UniversityAdmissionEntity } from './university_admission.entity';
import { UniversityTuitionEntity } from './university_tuition.entity';
import { ScholarshipEntity } from './scholarship.entity';
import { UniversityStudentLifeEntity } from './university_student_life.entity';
import { UniversitySportsEntity } from './university_sports.entity';
import { HousingEntity } from './housing.entity';
import { CareerOutcomesEntity } from './career_outcomes.entity';
import { NotableAlumniEntity } from './notable_alumni.entity';
import { UniversityRankingEntity } from './university_ranking.entity';
import { ReviewEntity } from './review.entity';
import { ResearchHubEntity } from './research_hub.entity';
import { EntrepreneurshipEntity } from './entrepreneurship.entity';
import { MentorInResidenceEntity } from './mentor_in_residence.entity';
import { AuthEntity } from './auth.entity';
import { JobEntity } from './job.entity';
import { OpportunityEntity } from './opportunity.entity';
import { ResearchNewsEntity } from './research_news.entity';
import { StaffEntity } from './staff.entity';
import { StudentAmbassadorEntity } from './student_ambassador.entity';
import { UserRoleAssignmentEntity } from './user_role_assignment.entity';
import { StudentEntity } from './student.entity';

@Entity('universities')
export class UniversityEntity extends parentEntity {
  @Column({ unique: true })
  university_name: string;

  @Column({ type: 'text', nullable: true })
  banner: string | null;

  @Column({ type: 'text', nullable: true })
  logo: string | null;

  @Column({ type: 'text', nullable: true })
  about: string | null;

  @Column({ type: 'text', nullable: true })
  mission_statement: string | null;

  @Column({ type: 'text', nullable: true })
  website: string | null;

  @Column({ default: 'inactive' }) // e.g., 'active', 'inactive', 'pending'
  status: string;

  @Column({ type: 'boolean', default: false })
  is_published: boolean;

  @OneToOne(() => AuthEntity, (auth) => auth.university, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @OneToOne(() => UniversityOverviewEntity, (overview) => overview.university, { cascade: true })
  @JoinColumn({ name: 'overview_id' })
  overview: UniversityOverviewEntity;

  @OneToMany(() => DepartmentEntity, (department) => department.university, { cascade: true })
  departments: DepartmentEntity[];

  @OneToMany(() => UniversityAdmissionEntity, (admission) => admission.university, { cascade: true })
  admissions: UniversityAdmissionEntity[];

  @OneToMany(() => UniversityTuitionEntity, (tuition) => tuition.university, { cascade: true })
  tuition_fees: UniversityTuitionEntity[];

  @OneToMany(() => ScholarshipEntity, (scholarship) => scholarship.university, { cascade: true })
  scholarships: ScholarshipEntity[];

  @OneToOne(() => UniversityStudentLifeEntity, (studentLife) => studentLife.university, { cascade: true })
  @JoinColumn({ name: 'student_life_id' })
  student_life: UniversityStudentLifeEntity;

  @OneToOne(() => UniversitySportsEntity, (sports) => sports.university, { cascade: true })
  @JoinColumn({ name: 'sports_id' })
  sports: UniversitySportsEntity;

  @OneToMany(() => HousingEntity, (housing) => housing.university, { cascade: true })
  housing_options: HousingEntity[];

  @OneToOne(() => CareerOutcomesEntity, (outcomes) => outcomes.university, { cascade: true })
  @JoinColumn({ name: 'career_outcomes_id' })
  career_outcomes: CareerOutcomesEntity;

  @OneToMany(() => NotableAlumniEntity, (alumni) => alumni.university, { cascade: true })
  notable_alumni: NotableAlumniEntity[];

  @OneToMany(
    () => MentorInResidenceEntity,
    (mentor_in_residence) => mentor_in_residence.university,
  )
  mentor_in_residence: MentorInResidenceEntity[];

  @OneToMany(() => UniversityRankingEntity, (ranking) => ranking.university, { cascade: true })
  rankings: UniversityRankingEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.university, { cascade: true })
  reviews: ReviewEntity[];

  @OneToMany(() => ResearchHubEntity, (hub) => hub.university, { cascade: true })
  research_hubs: ResearchHubEntity[];

  @OneToMany(() => EntrepreneurshipEntity, (e) => e.university, { cascade: true })
  entrepreneurship_programs: EntrepreneurshipEntity[];

  @OneToMany(() => JobEntity, (jobs) => jobs.university)
  jobs: JobEntity[];

  @OneToMany(() => OpportunityEntity, (opportunity) => opportunity.university)
  opportunity: OpportunityEntity[];

  @OneToMany(
    () => ResearchNewsEntity,
    (research_news) => research_news.university,
  )
  research_news: ResearchNewsEntity[];

  @OneToMany(() => StaffEntity, (staff) => staff.university)
  staffs: StaffEntity[];

  @OneToMany(
    () => StudentAmbassadorEntity,
    (student_ambassador) => student_ambassador.university,
  )
  student_ambassador: StudentAmbassadorEntity[];

  @OneToMany(
    () => StudentEntity,
    (student) => student.university,
  )
  students: StudentEntity[];

  @OneToMany(() => UserRoleAssignmentEntity, (assignment) => assignment.institutionScope)
  roleAssignments: UserRoleAssignmentEntity[];

}