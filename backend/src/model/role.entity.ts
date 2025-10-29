import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { PermissionEntity } from './permission.entity';

@Entity('roles')
export class RoleEntity extends parentEntity {
  @Column({
    unique: true,
    comment: 'The code-level key of the role, e.g., "DEPARTMENT_ADMIN"',
  })
  key: string;

  @Column({
    unique: true, // Role names should also be unique
    comment: 'User-friendly display name, e.g., "Department Admin"',
  })
  name: string;
  
  @Column({
    comment: 'A user-friendly description of the role',
  })
  description: string;

  @Column({
    comment: 'Determines the access level, e.g., University, Institution, Department',
  })
  scope: string;

  @Column({
    type: 'int',
    default: 0,
    comment: 'A numeric level for hierarchy. Higher numbers mean more permissions.',
  })
  level: number;

  @Column({
    default: false,
    comment: 'If true, this role is assigned to new users by default',
  })
  isDefault: boolean;

  @ManyToMany(() => PermissionEntity, {
    cascade: true,
    eager: true, // Automatically load permissions when a role is fetched
  })
  @JoinTable({
    name: 'role_permissions',
    joinColumn: { name: 'role_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'permission_id', referencedColumnName: 'id' },
  })
  permissions: PermissionEntity[];
}