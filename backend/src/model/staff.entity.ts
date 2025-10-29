import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { parentEntity } from './parent.entity';
import { AuthEntity } from './auth.entity';
import { UniversityEntity } from './university.entity';
// import { PermissionEntity } from './permission.entity';
import { DepartmentEntity } from './department.entity';
import { InstitutionEntity } from './institution.entity';
import { UserStatus } from 'src/helper/enums/user-status.enum';
// import { DivisionEntity } from './division.entity';

@Entity('staffs')
export class StaffEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ default: null, nullable: true })
  address: string;

  @Column({ default: null, nullable: true })
  photo: string;

  @Column({ unique: false, nullable: true })
  phone: string;

  @Column({ nullable: true })
  job_title: string;

  @Column({ default: UserStatus.WAITING_APPROVAL })
  status: UserStatus;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => AuthEntity, (auth) => auth.staff)
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @ManyToOne(() => UniversityEntity, (university) => university.staffs, { nullable: true })
  university: UniversityEntity;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.staffs, { nullable: true })
  institution: InstitutionEntity;

  @ManyToOne(() => DepartmentEntity, (department) => department.staffs, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'department_id' })
  department: DepartmentEntity | null;

  // @ManyToOne(() => DivisionEntity, (division) => division.staff)
  // @JoinColumn({ name: 'division_id' })
  // division: DivisionEntity;
}
