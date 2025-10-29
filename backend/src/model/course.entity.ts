import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { ProgramEntity } from './program.entity';
import { FacultyEntity } from './faculty.entity';

@Entity('courses')
export class CourseEntity extends parentEntity {
  @Column()
  course_code: string; // e.g., 'CS101'

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  credits: number;

  @Column({ type: 'simple-array', nullable: true })
  semestersOffered: string[]; // e.g., ['Fall', 'Spring']

  @ManyToOne(() => ProgramEntity, (program) => program.courses, { onDelete: 'CASCADE' })
  program: ProgramEntity;

  @ManyToOne(() => FacultyEntity, (faculty) => faculty.courses, { nullable: true, onDelete: 'SET NULL' })
  instructor: FacultyEntity;

  @ManyToMany(() => CourseEntity)
  @JoinTable({
      name: 'course_prerequisites',
      joinColumn: { name: 'course_id' },
      inverseJoinColumn: { name: 'prerequisite_id' },
  })
  prerequisites: CourseEntity[];
}