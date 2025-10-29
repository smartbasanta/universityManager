import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne, Tree, TreeChildren, TreeParent } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { ProgramEntity } from './program.entity';
import { FacultyEntity } from './faculty.entity';
import { StaffEntity } from './staff.entity';
import { OpportunityEntity } from './opportunity.entity';
import { JobEntity } from './job.entity';
import { ScholarshipEntity } from './scholarship.entity';
import { ResearchNewsEntity } from './research_news.entity';
import { StudentAmbassadorEntity } from './student_ambassador.entity';
import { InstitutionEntity } from './institution.entity';
import { UserRoleAssignmentEntity } from './user_role_assignment.entity';
import { AuthEntity } from './auth.entity';
import { MentorInResidenceEntity } from './mentor_in_residence.entity';

@Entity('departments')
@Tree('closure-table') // Enables hierarchical structure (e.g., Division > Department)
export class DepartmentEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  contactEmail: string;

  @Column({ nullable: true })
  officePhone: string;

  @OneToOne(() => AuthEntity, (auth) => auth.institute, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @ManyToOne(() => UniversityEntity, (university) => university.departments, { onDelete: 'CASCADE' })
  university: UniversityEntity;

  @TreeParent()
  parent: DepartmentEntity; // For creating hierarchies (e.g., a School/Division as a parent)

  @TreeChildren()
  children: DepartmentEntity[]; // Sub-departments

  @OneToMany(() => ProgramEntity, (program) => program.department, { cascade: true })
  programs: ProgramEntity[];

  @OneToMany(() => FacultyEntity, (faculty) => faculty.department, { cascade: true })
  faculty: FacultyEntity[];

  @OneToMany(() => StaffEntity, (staff) => staff.department)
  staffs: StaffEntity[];

  @OneToMany(() => MentorInResidenceEntity, (mentors_in_residence) => mentors_in_residence.department)
  mentors_in_residence: MentorInResidenceEntity[];

  @ManyToOne(()=>InstitutionEntity, (institution)=> institution.department)
  institution: InstitutionEntity;

  @OneToMany(() => OpportunityEntity, (opportunity) => opportunity.department)
  opportunities: OpportunityEntity[];

  @OneToMany(() => JobEntity, (job) => job.department)
  jobs: JobEntity[];

  @OneToMany(() => ScholarshipEntity, (scholarship) => scholarship.department)
  scholarships: ScholarshipEntity[];

  @OneToMany(() => ResearchNewsEntity, (news) => news.department)
  research_news: ResearchNewsEntity[];

  @OneToMany(() => StudentAmbassadorEntity, (news) => news.department)
  student_ambassador: StudentAmbassadorEntity[];

  @ManyToOne(() => FacultyEntity)
  @JoinColumn()
  departmentHead: FacultyEntity;

  @OneToMany(() => UserRoleAssignmentEntity, (assignment) => assignment.departmentScope)
  roleAssignments: UserRoleAssignmentEntity[];
  
}