import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';

@Entity('notable_alumnis')
export class NotableAlumniEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ type: 'int' })
  graduation_year: number;

  @Column()
  notable_field: string; // e.g., 'Business', 'Politics', 'Arts'

  @Column({ type: 'text' })
  accomplishments: string;

  @ManyToOne(() => UniversityEntity, (university) => university.notable_alumni, { onDelete: 'CASCADE' })
  university: UniversityEntity;
}