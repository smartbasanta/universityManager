import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { SportsFacilityEntity } from './sports_facility.entity';

@Entity('hosted_events')
export class HostedEventEntity extends parentEntity {
  @Column()
  event_name: string; // e.g., 'NCAA Men's Basketball Tournament - First Round'

  @Column()
  sport: string; // e.g., 'Basketball'

  @Column({ type: 'date' })
  event_date: Date;

  @Column({ type: 'text', nullable: true })
  description: string; // e.g., 'Hosted games for the East Regional bracket.'

  @ManyToOne(() => SportsFacilityEntity, (facility) => facility.significant_events_hosted, { onDelete: 'CASCADE' })
  facility: SportsFacilityEntity;
}