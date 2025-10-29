import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { StudentEntity } from './student.entity';

export enum AuthorType {
  STUDENT = 'student',
  ALUMNI = 'alumni',
  PARENT = 'parent',
  FACULTY = 'faculty',
  PROSPECTIVE_STUDENT = 'prospective_student',
}

@Entity('reviews')
export class ReviewEntity extends parentEntity {
  @Column({ type: 'int' }) // Rating from 1 to 5
  rating: number;

  @Column({ type: 'text' })
  comment: string;

  // @Column({ nullable: true })
  // author_name: string; // Optional author name

  // @Column({ type: 'enum', enum: AuthorType, default: AuthorType.STUDENT })
  // author_type: AuthorType;

  @ManyToOne(() => StudentEntity, (student) => student.reviews, { onDelete: 'CASCADE' })
  author: StudentEntity;

  @ManyToOne(() => UniversityEntity, (university) => university.reviews, { onDelete: 'CASCADE' })
  university: UniversityEntity;

  @ManyToOne(() => StudentEntity, (student) => student.reviews, {
    onDelete: 'CASCADE',
  })
  student: StudentEntity;
}