import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';

@Entity('university_rankings')
export class UniversityRankingEntity extends parentEntity {
  @Column()
  source: string; // e.g., 'U.S. News & World Report'

  @Column({ type: 'int' })
  year: number;

  @Column()
  subject: string; // e.g., 'National Universities', 'Best Computer Science Schools'

  @Column()
  rank: string; // Using string for values like 'T-10', '50-100'

  @Column({ nullable: true })
  source_link: string;

  @ManyToOne(() => UniversityEntity, (university) => university.rankings, { onDelete: 'CASCADE' })
  university: UniversityEntity;
}