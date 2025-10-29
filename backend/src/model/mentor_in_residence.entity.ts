import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { AuthEntity } from './auth.entity';
import { UniversityEntity } from './university.entity';
import { DepartmentEntity } from './department.entity'; // Using consolidated entity
import { InstitutionEntity } from './institution.entity';
import { SlotEntity } from './slot.entity';
import { PersonStatus } from 'src/helper/enums/user-status.enum';

@Entity('mentors_in_residence')
export class MentorInResidenceEntity extends parentEntity {
  @OneToOne(() => AuthEntity, (auth) => auth.mentor_in_residence, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @Column()
  name: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ type: 'enum', enum: PersonStatus, default: PersonStatus.PENDING_APPROVAL })
  status: PersonStatus;

  // Profile Information
  @Column({ type: 'text', nullable: true })
  about: string;

  @Column({ nullable: true })
  linkedin_url: string;

  @Column({ nullable: true })
  meeting_url: string; // e.g., Calendly link

  @Column({ type: 'simple-array', nullable: true })
  languages: string[];

  @Column({ nullable: true })
  education: string;

  @Column({ type: 'simple-array', nullable: true })
  expertise_areas: string[];
  
  // Relationships
  @OneToMany(() => SlotEntity, (slot) => slot.mentor_in_residence)
  slots: SlotEntity[];

  @ManyToOne(() => UniversityEntity, (university) => university.staffs, { nullable: true })
  university: UniversityEntity;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.staffs, { nullable: true })
  institution: InstitutionEntity;

  @ManyToOne(() => DepartmentEntity, (department) => department.staffs, { nullable: true, onDelete: 'SET NULL' })
  department: DepartmentEntity;

}