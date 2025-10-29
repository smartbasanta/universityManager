import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { EntrepreneurshipEntity } from './entrepreneurship.entity';

@Entity('startup_stories')
export class StartupStoryEntity extends parentEntity {
  @Column()
  company_name: string;

  @Column({ type: 'int', nullable: true })
  year_founded: number;

  @Column({ type: 'simple-array', nullable: true })
  founders: string[]; // Could link to alumni entity in the future

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'bigint', nullable: true })
  funding_raised: number;

  @Column({ nullable: true })
  company_website: string;

  @ManyToOne(() => EntrepreneurshipEntity, (e) => e.startup_stories, { onDelete: 'CASCADE' })
  entrepreneurship: EntrepreneurshipEntity;
}