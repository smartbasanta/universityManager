import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityAdmissionEntity } from './university_admission.entity';

export enum RequirementType {
  TEST_SCORE = 'test_score',
  GPA = 'gpa',
  ESSAY = 'essay',
  RECOMMENDATION = 'recommendation',
  TRANSCRIPT = 'transcript',
  OTHER = 'other',
}

@Entity('university_admission_requirements')
export class UniversityAdmissionRequirementEntity extends parentEntity {
  @Column()
  name: string; // e.g., 'SAT Evidence-Based Reading and Writing', 'High School GPA'

  @Column({ type: 'enum', enum: RequirementType })
  type: RequirementType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  is_required: boolean;

  @Column({ nullable: true })
  percentile_25: string;

  @Column({ nullable: true })
  percentile_75: string;

  @ManyToOne(() => UniversityAdmissionEntity, (admission) => admission.requirements, { onDelete: 'CASCADE' })
  admission: UniversityAdmissionEntity;
}