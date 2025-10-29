import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { AuthEntity } from './auth.entity';
import { DepartmentEntity } from './department.entity';
// import { DivisionEntity } from './division.entity';
import { ResearchNewsEntity } from './research_news.entity';
import { ScholarshipEntity } from './scholarship.entity';
import { JobEntity } from './job.entity';
import { OpportunityEntity } from './opportunity.entity';
import { MentorInResidenceEntity } from './mentor_in_residence.entity';
import { StaffEntity } from './staff.entity';
import { UserRoleAssignmentEntity } from './user_role_assignment.entity';

@Entity('institutions')
export class InstitutionEntity extends parentEntity {
  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  banner: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  overview: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  verifyPage: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  companySize: string;

  @Column({ nullable: true })
  headquarters: string;

  @Column({ nullable: true })
  companyType: string;

  @Column({ type: 'text', array: true, nullable: true })
  specialities: string[];

  @Column({ type: 'text', array: true, nullable: true })
  commitments: string[];

  @Column({ nullable: true })
  careerGrowth: string;

  @Column({ nullable: true })
  program: string;

  @Column({ nullable: true })
  division: string;

  @OneToOne(() => AuthEntity, (auth) => auth.institute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @OneToMany(() => DepartmentEntity, (dept) => dept.institution)
  department: DepartmentEntity[];

  // @OneToMany(() => DivisionEntity, (division) => division.institution)
  // divisions: DivisionEntity[];

  @OneToMany(
    () => ResearchNewsEntity,
    (research_news) => research_news.institution,
  )
  research_news: ResearchNewsEntity[];

  @OneToMany(() => ScholarshipEntity, (scholarship) => scholarship.institution)
  scholarships: ScholarshipEntity[];

  @OneToMany(() => JobEntity, (job) => job.institution)
  jobs: JobEntity[];

  @OneToMany(() => OpportunityEntity, (opportunity) => opportunity.institution)
  opportunity: OpportunityEntity[];

  @OneToMany(
    () => MentorInResidenceEntity,
    (mentor_in_residence) => mentor_in_residence.institution,
  )
  mentor_in_residence: MentorInResidenceEntity[];

  @OneToMany(() => StaffEntity, (staff) => staff.institution)
  staffs: StaffEntity[];

  @OneToMany(() => UserRoleAssignmentEntity, (assignment) => assignment.institutionScope)
  roleAssignments: UserRoleAssignmentEntity[];
}
