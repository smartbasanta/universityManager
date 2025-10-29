import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { EntrepreneurshipEntity } from './entrepreneurship.entity';

@Entity('hackathons')
export class HackathonEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  frequency: string; // e.g., 'Annual', 'Biannual'

  @ManyToOne(() => EntrepreneurshipEntity, (e) => e.hackathons, { onDelete: 'CASCADE' })
  entrepreneurship: EntrepreneurshipEntity;
}