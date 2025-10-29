import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { UniversityAdmissionRequirementEntity } from './university_admission_requirement.entity';

export enum AdmissionLevel {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
}

@Entity('university_admissions')
export class UniversityAdmissionEntity extends parentEntity {
  @Column({ type: 'enum', enum: AdmissionLevel })
  level: AdmissionLevel;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  acceptance_rate: number;

  @Column({ type: 'date', nullable: true })
  application_deadline: Date;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  application_fee: number;

  @Column({ nullable: true })
  application_website: string;

  @ManyToOne(() => UniversityEntity, (university) => university.admissions, { onDelete: 'CASCADE' })
  university: UniversityEntity;

  @OneToMany(() => UniversityAdmissionRequirementEntity, (req) => req.admission, { cascade: true })
  requirements: UniversityAdmissionRequirementEntity[];
}