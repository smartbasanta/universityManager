import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { JobEntity } from './job.entity';
import { parentEntity } from './parent.entity';
import { JobAnswerEntity } from './job_answer.entity';

export enum JobQuestionType {
  TEXT_INPUT = 'Text Input',
  TEXTAREA = 'Textarea',
  DROPDOWN = 'Dropdown',
  RADIO_BUTTONS = 'Radio Buttons',
  CHECKBOXES = 'Checkboxes',
  FILE_UPLOAD = 'File Upload',
}

@Entity('job_questions')
export class JobQuestionEntity extends parentEntity {
  @Column()
  label: string;

  @Column({ type: 'enum', enum: JobQuestionType })
  type: JobQuestionType;

  @Column({ default: false })
  required: boolean;

  @ManyToOne(() => JobEntity, (job) => job.questions, {
    onDelete: 'CASCADE',
  })
  job: JobEntity;

  @OneToMany(() => JobAnswerEntity, (ans) => ans.question)
  answers: JobAnswerEntity[];
}
