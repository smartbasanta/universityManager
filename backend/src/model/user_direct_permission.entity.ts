import { Entity, ManyToOne, Column } from 'typeorm';
import { parentEntity } from './parent.entity';
import { AuthEntity } from './auth.entity';
import { PermissionEntity } from './permission.entity';

@Entity('user_direct_permissions')
export class UserDirectPermissionEntity extends parentEntity {
  @ManyToOne(() => AuthEntity, (user) => user.directPermissions, { onDelete: 'CASCADE' })
  user: AuthEntity;

  @ManyToOne(() => PermissionEntity, { eager: true, onDelete: 'CASCADE' })
  permission: PermissionEntity;

  @Column({ type: 'timestamp', nullable: true, comment: 'The date when this permission expires' })
  expiresAt: Date | null;

//   @ManyToOne(() => AuthEntity, { nullable: true, onDelete: 'SET NULL', comment: 'The admin who granted this permission' })
//   grantedBy: AuthEntity | null;
}