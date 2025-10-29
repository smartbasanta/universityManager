import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';

@Entity('research_hubs')
export class ResearchHubEntity extends parentEntity {
  @Column()
  center_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website_url: string;

  @ManyToOne(() => UniversityEntity, (university) => university.research_hubs, { onDelete: 'CASCADE' })
  university: UniversityEntity;
}