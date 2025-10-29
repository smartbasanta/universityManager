import { Entity, ManyToOne, Column } from 'typeorm';
import { parentEntity } from './parent.entity';
import { AuthEntity } from './auth.entity';
import { PermissionEntity } from './permission.entity';

@Entity('revoked_permissions')
export class RevokedPermissionEntity extends parentEntity {
  @ManyToOne(() => AuthEntity, (user) => user.revokedPermissions, { onDelete: 'CASCADE' })
  user: AuthEntity;

  @ManyToOne(() => PermissionEntity, { eager: true, onDelete: 'CASCADE' })
  permission: PermissionEntity;

  @Column({ type: 'text', nullable: true, comment: 'Reason for revoking the permission' })
  reason: string | null;
//   @ManyToOne(() => AuthEntity, { nullable: true, onDelete: 'SET NULL', comment: 'The admin who revoked this permission' })
//   revokedBy: AuthEntity | null;
}