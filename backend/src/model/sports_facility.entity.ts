import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversitySportsEntity } from './university_sports.entity';
import { HostedEventEntity } from './hosted_event.entity'; // Import the new entity

@Entity('sports_facilities')
export class SportsFacilityEntity extends parentEntity {
  @Column()
  name: string; // e.g., 'Memorial Stadium', 'Aquatics Center'

  @Column({ type: 'int', nullable: true })
  capacity: number;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ type: 'simple-array', nullable: true })
  supported_sports: string[]; // General sports the facility is equipped for

  @ManyToOne(() => UniversitySportsEntity, (sports) => sports.facilities, { onDelete: 'CASCADE' })
  universitySports: UniversitySportsEntity;

  @OneToMany(() => HostedEventEntity, (event) => event.facility, { cascade: true })
  significant_events_hosted: HostedEventEntity[]; // New relationship
}