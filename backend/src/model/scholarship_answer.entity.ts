import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobQuestionEntity } from './job_question.entity';
import { StudentEntity } from './student.entity';
import { ScholarshipQuestionEntity } from './scholarship_question.entity';

@Entity('scholarship_answers')
export class ScholarshipAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  answer: string;

  @ManyToOne(() => StudentEntity, (student) => student.jobAnswers, {
    onDelete: 'CASCADE',
  })
  student: StudentEntity;

  @ManyToOne(() => ScholarshipQuestionEntity, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: ScholarshipQuestionEntity;

  @CreateDateColumn()
  createdAt: Date;
}
