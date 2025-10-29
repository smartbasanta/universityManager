import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';

@Entity('university_overviews')
export class UniversityOverviewEntity extends parentEntity {
  @Column({ nullable: true })
  student_faculty_ratio: string;

  @Column({ type: 'bigint', nullable: true })
  research_expenditure: number;

  @Column({ type: 'bigint', nullable: true })
  endowment: number;

  @Column({ type: 'varchar', nullable: true })
  university_type: string; // e.g., 'Public', 'Private'

  @Column({ nullable: true })
  campus_setting: string; // e.g., 'Urban', 'Suburban', 'Rural'

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  state: string;

  @Column({ nullable: true })
  city: string;

  @Column({ nullable: true })
  zip_code: string;

  @OneToOne(() => UniversityEntity, (university) => university.overview, { onDelete: 'CASCADE' })
  university: UniversityEntity;
}