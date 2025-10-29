import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { ProgramEntity } from './program.entity'; // Linking to the program directly

export enum OutcomeType {
  GRADUATION_RATE = 'graduation_rate',
  EMPLOYMENT_RATE = 'employment_rate',
  MEDIAN_EARNINGS = 'median_earnings',
  AVERAGE_TIME_TO_DEGREE = 'average_time_to_degree',
}

@Entity('program_outcomes')
export class ProgramOutcomeEntity extends parentEntity {
  @ManyToOne(() => ProgramEntity, (program) => program.outcomes, { onDelete: 'CASCADE' })
  program: ProgramEntity;

  @Column({ type: 'enum', enum: OutcomeType })
  type: OutcomeType;

  @Column({ type: 'int' })
  year: number; // The year this data point is for (e.g., 2024)

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  value: number; // The actual value (e.g., 92.5 for rate, 85000 for earnings, 4.1 for time to degree)

  @Column()
  value_unit: string; // '%', 'USD', 'Years'

  @Column({ type: 'text', nullable: true })
  description: string; // e.g., '6 months after graduation'

  @Column({ nullable: true })
  source_link: string;

  @Column({ default: false })
  isDraft: boolean;
  // You will need to add the following to program.entity.ts:
  @OneToMany(() => ProgramOutcomeEntity, (outcome) => outcome.program, { cascade: true })
  outcomes: ProgramOutcomeEntity[];
}
