import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { RoomOptionEntity } from './room_option.entity';

@Entity('housings')
export class HousingEntity extends parentEntity {
  @Column()
  residence_name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'simple-array', nullable: true })
  amenities: string[]; // e.g., 'Wi-Fi', 'Laundry', 'Gym'

  @ManyToOne(() => UniversityEntity, (university) => university.housing_options, { onDelete: 'CASCADE' })
  university: UniversityEntity;

  @OneToMany(() => RoomOptionEntity, (option) => option.housing, { cascade: true })
  room_options: RoomOptionEntity[];
}