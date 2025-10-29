import {
  Entity,
  Column,
  ManyToOne,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { JobQuestionEntity } from './job_question.entity';
import { StudentEntity } from './student.entity';

@Entity('job_answers')
export class JobAnswerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  answer: string;

  @ManyToOne(() => StudentEntity, (student) => student.jobAnswers, {
    onDelete: 'CASCADE',
  })
  student: StudentEntity;

  @ManyToOne(() => JobQuestionEntity, (question) => question.answers, {
    onDelete: 'CASCADE',
  })
  question: JobQuestionEntity;

  @CreateDateColumn()
  createdAt: Date;
}
