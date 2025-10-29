import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { DepartmentEntity } from './department.entity';
import { CourseEntity } from './course.entity';
import { ProgramOutcomeEntity } from './program_outcome.entity';
import { StudentEntity } from './student.entity';

export enum ProgramLevel {
  UNDERGRADUATE = 'undergraduate',
  GRADUATE = 'graduate',
  DOCTORAL = 'doctoral',
  CERTIFICATE = 'certificate',
}

@Entity('programs')
export class ProgramEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: ProgramLevel })
  level: ProgramLevel;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  duration: string; // e.g., '4 Years'

  @Column({ type: 'int', nullable: true })
  total_credits: number;

  @ManyToOne(() => DepartmentEntity, (department) => department.programs, { onDelete: 'CASCADE' })
  department: DepartmentEntity;

  @OneToMany(() => CourseEntity, (course) => course.program, { cascade: true })
  courses: CourseEntity[];

  @OneToMany(() => ProgramOutcomeEntity, (outcome) => outcome.program, { cascade: true })
  outcomes: ProgramOutcomeEntity[];

  @OneToMany(
      () => StudentEntity,
      (student) => student.university,
    )
    students: StudentEntity[];
}