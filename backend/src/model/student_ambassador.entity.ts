import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { AuthEntity } from './auth.entity';
import { DepartmentEntity } from './department.entity';
// import { DivisionEntity } from './division.entity';
import { SlotEntity } from './slot.entity';
import { InstitutionEntity } from './institution.entity';
import { UserStatus } from 'src/helper/enums/user-status.enum';

@Entity('student_ambassadors')
export class StudentAmbassadorEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ default: null, nullable: true })
  photo: string;

  @Column({ nullable: true })
  major: string; // More specific than 'school' or 'education' for an ambassador

  @Column({ type: 'varchar', nullable: true })
  linkedin: string;

  @Column({ type: 'varchar', nullable: true })
  meetingLink: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  languages: string[];

  @Column({ type: 'varchar', nullable: true })
  education: string;

  @Column({ type: 'varchar', array: true, nullable: true })
  expertiseArea: string[];

  @Column({ type: 'varchar', array: true, nullable: true })
  focusArea: string[];

  @Column({ type: 'varchar', nullable: true })
  about: string;

  @Column({ type: 'varchar', nullable: true })
  profileStatus: string;

  @Column({ type: 'varchar', default: UserStatus.WAITING_APPROVAL })
  status: UserStatus;

  // @ManyToOne(() => DivisionEntity, (division) => division.student_ambassador, {
  //   onDelete: 'CASCADE',
  //   nullable: true,
  // })
  // division: DivisionEntity;

  @ManyToOne(() => UniversityEntity, (university) => university.staffs, { nullable: true })
  university: UniversityEntity;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.staffs, { nullable: true })
  institution: InstitutionEntity;

  @ManyToOne(() => DepartmentEntity, (department) => department.staffs, { nullable: true, onDelete: 'SET NULL' })
  department: DepartmentEntity;

  @OneToOne(() => AuthEntity, (auth) => auth.student_ambassador, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;


  @OneToMany(() => SlotEntity, (slot) => slot.student_ambassador)
  slots: SlotEntity[];
}
