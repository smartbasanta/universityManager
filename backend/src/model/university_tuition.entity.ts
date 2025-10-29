import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { ProgramLevel } from './program.entity';

export enum ResidencyType {
  IN_STATE = 'in-state',
  OUT_OF_STATE = 'out-of-state',
  INTERNATIONAL = 'international',
}

@Entity('university_tuitions')
export class UniversityTuitionEntity extends parentEntity {
  @Column({ type: 'enum', enum: ProgramLevel })
  level: ProgramLevel;

  @Column({ type: 'enum', enum: ResidencyType })
  residency: ResidencyType;

  @Column({ type: 'int' })
  academic_year: number; // e.g., 2025

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  tuition_and_fees: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  books_and_supplies_cost: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  housing_cost: number | null;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  meal_plan_cost: number | null;

  @Column({ type: 'varchar', nullable: true })
  source_link: string | null;

  @ManyToOne(() => UniversityEntity, (university) => university.tuition_fees, { onDelete: 'CASCADE' })
  university: UniversityEntity;
}