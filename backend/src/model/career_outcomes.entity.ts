import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { TopEmployerEntity } from './top_employer.entity';

@Entity('career_outcomes')
export class CareerOutcomesEntity extends parentEntity {
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  employment_rate_6_months: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  median_starting_salary: number;

  @Column({ nullable: true })
  report_source_url: string;

  @Column({ type: 'int', nullable: true })
  report_year: number;

  @OneToOne(() => UniversityEntity, (university) => university.career_outcomes, { onDelete: 'CASCADE' })
  university: UniversityEntity;

  @OneToMany(() => TopEmployerEntity, (employer) => employer.careerOutcomes, { cascade: true })
  top_employers: TopEmployerEntity[];
}