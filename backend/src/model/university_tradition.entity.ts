import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityStudentLifeEntity } from './university_student_life.entity';

@Entity('university_traditions')
export class UniversityTraditionEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  time_of_year: string; // e.g., 'Homecoming Week', 'First Day of Spring'

  @Column({ type: 'text', nullable: true })
  history: string;

  @ManyToOne(() => UniversityStudentLifeEntity, (life) => life.traditions, { onDelete: 'CASCADE' })
  studentLife: UniversityStudentLifeEntity;
}