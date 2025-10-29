import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { DepartmentEntity } from './department.entity';
import { CourseEntity } from './course.entity';

@Entity('faculties')
export class FacultyEntity extends parentEntity {
  @Column()
  name: string;

  @Column()
  title: string; // e.g., 'Professor of Computer Science'

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  office_location: string;

  @Column({ type: 'simple-array', nullable: true })
  research_interests: string[];

  @ManyToOne(() => DepartmentEntity, (department) => department.faculty, { onDelete: 'CASCADE' })
  department: DepartmentEntity;

  @OneToMany(() => CourseEntity, (course) => course.instructor)
  courses: CourseEntity[];
}