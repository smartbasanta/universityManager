import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { EntrepreneurshipEntity } from './entrepreneurship.entity';

@Entity('incubators')
export class IncubatorEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'simple-array', nullable: true })
  focus_areas: string[]; // e.g., 'FinTech', 'BioTech', 'SaaS'

  @ManyToOne(() => EntrepreneurshipEntity, (e) => e.incubators, { onDelete: 'CASCADE' })
  entrepreneurship: EntrepreneurshipEntity;
}