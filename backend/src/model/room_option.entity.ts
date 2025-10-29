import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { HousingEntity } from './housing.entity';

@Entity('room_options')
export class RoomOptionEntity extends parentEntity {
  @Column()
  room_type: string; // e.g., 'Single', 'Double with Private Bath', 'Suite'

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost_per_semester: number;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  virtual_tour_url: string;

  @ManyToOne(() => HousingEntity, (housing) => housing.room_options, { onDelete: 'CASCADE' })
  housing: HousingEntity;
}