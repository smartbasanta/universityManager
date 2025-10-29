import { Column, DeleteDateColumn, Entity, JoinTable, ManyToMany, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { roleType } from 'src/helper/types/index.type';
import { StaffEntity } from './staff.entity';
import { UniversityEntity } from './university.entity';
import { StudentEntity } from './student.entity';
import { StudentAmbassadorEntity } from './student_ambassador.entity';
import { ResearchNewsEntity } from './research_news.entity';
import { MentorInResidenceEntity } from './mentor_in_residence.entity';
import { InstitutionEntity } from './institution.entity';
import { OpportunityEntity } from './opportunity.entity';
import { PermissionEntity } from './permission.entity';
import { UserRoleAssignmentEntity } from './user_role_assignment.entity';
import { DepartmentEntity } from './department.entity';
import { ScholarshipEntity } from './scholarship.entity';
import { JobEntity } from './job.entity';
import { UserDirectPermissionEntity } from './user_direct_permission.entity';
import { RevokedPermissionEntity } from './revoked_permission.entity';
import { UserType } from 'src/helper/enums/user-type.enum';
@Entity('auths')
export class AuthEntity extends parentEntity {
  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column({ nullable: true, unique: true })
  googleId: string; // Store Google ID for OAuth users

  @Column({ nullable:true, default: null })
  rToken: string;

  @Column({
    type: 'enum',
    enum: UserType,
    nullable: true, // This is for the database
    comment: 'Defines the primary role/scope of the user',
  })
  userType: UserType | null; // This tells TypeScript the property can be null

  @Column({ type: 'boolean', default: false })
  isVerified: boolean; // Has the user verified their email?

  @Column({ type: 'timestamp', nullable: true })
  lastPasswordChanged: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @DeleteDateColumn()

  @OneToOne(() => UniversityEntity, (university) => university.auth, {
    onDelete: 'CASCADE',
  })
  university: UniversityEntity;

  @OneToOne(() => InstitutionEntity, (institute) => institute.auth, {
    onDelete: 'CASCADE',
  })
  institute: InstitutionEntity;

  @OneToOne(() => DepartmentEntity, (department) => department.auth, {
    onDelete: 'CASCADE',
  })
  department: DepartmentEntity;

  @OneToOne(() => StaffEntity, (staff) => staff.auth)
  staff: StaffEntity;

  @OneToOne(() => StudentEntity, (student) => student.auth, {
    onDelete: 'CASCADE',
  })
  student: StudentEntity;

  @OneToOne(
    () => StudentAmbassadorEntity,
    (student_ambassador) => student_ambassador.auth,
    {
      onDelete: 'CASCADE',
    },
  )
  student_ambassador: StudentAmbassadorEntity;

  // a user creates research news
  @OneToMany(() => ResearchNewsEntity, (research_news) => research_news.auth)
  research_news: ResearchNewsEntity[];

  // a user creates scholarship
  @OneToMany(() => ScholarshipEntity, (scholarship) => scholarship.auth) // Corrected
  scholarship: ScholarshipEntity[];

  // a user creates jobs
  @OneToMany(() => JobEntity, (jobs) => jobs.auth)
  jobs: JobEntity[];

  // a user creates opportunities
  @OneToMany(() => OpportunityEntity, (opportunity) => opportunity.auth)
  opportunity: OpportunityEntity[];

  @OneToOne(
    () => MentorInResidenceEntity,
    (mentor_in_residence) => mentor_in_residence.auth,
    {
      onDelete: 'CASCADE',
    },
  )
  mentor_in_residence: MentorInResidenceEntity;

  @OneToMany(() => UserRoleAssignmentEntity, (assignment) => assignment.user, {
    cascade: true,
  })
  roleAssignments: UserRoleAssignmentEntity[];

  // For the feature: "permissions can be assigned directly"
  // @ManyToMany(() => PermissionEntity, { cascade: true })
  // @JoinTable({
  //   name: 'user_direct_permissions',
  //   joinColumn: { name: 'user_id', referencedColumnName: 'id' },
  //   inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  // })
  // directPermissions: PermissionEntity[];

  @OneToMany(() => UserDirectPermissionEntity, (directPermission) => directPermission.user, { cascade: true })
  directPermissions: UserDirectPermissionEntity[];

  // THIS IS FOR REVOKED PERMISSIONS
  @OneToMany(() => RevokedPermissionEntity, (revokedPermission) => revokedPermission.user, { cascade: true })
  revokedPermissions: RevokedPermissionEntity[];
}
