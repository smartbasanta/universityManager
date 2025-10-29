import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { AuthEntity } from './auth.entity';
import { RoleEntity } from './role.entity';
import { UniversityEntity } from './university.entity';
import { InstitutionEntity } from './institution.entity';
import { DepartmentEntity } from './department.entity';

@Entity('user_role_assignments')
export class UserRoleAssignmentEntity extends parentEntity {
  @Column({ type: 'timestamp', nullable: true, comment: 'The date when this role assignment expires' })
  expiresAt: Date | null;

  //this column or relationship need more work
  // @ManyToOne(() => AuthEntity, { nullable: true, onDelete: 'SET NULL', comment: 'The admin who granted this role' })
  // grantedBy: AuthEntity | null;

  @ManyToOne(() => AuthEntity, (user) => user.roleAssignments, {
    onDelete: 'CASCADE',
  })
  user: AuthEntity;

  @ManyToOne(() => RoleEntity, {
    eager: true, // Always load the role details
    onDelete: 'CASCADE',
  })
  role: RoleEntity;

  // --- SCOPE COLUMNS ---
  // These columns define the context of the role assignment.
  // Usually, only ONE of these will be filled per assignment.

  @ManyToOne(() => UniversityEntity, (university) => university.roleAssignments, { nullable: true, onDelete: 'CASCADE' })
  universityScope: UniversityEntity;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.roleAssignments, { nullable: true, onDelete: 'CASCADE' })
  institutionScope: InstitutionEntity;

  @ManyToOne(() => DepartmentEntity, (department) => department.roleAssignments, { nullable: true, onDelete: 'CASCADE' })
  departmentScope: DepartmentEntity;
}