import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { ScholarshipEntity } from './scholarship.entity';
import { ScholarshipAnswerEntity } from './scholarship_answer.entity';

export enum QuestionType {
  TEXT_INPUT = 'Text Input',
  TEXTAREA = 'Textarea',
  DROPDOWN = 'Dropdown',
  RADIO_BUTTONS = 'Radio Buttons',
  CHECKBOXES = 'Checkboxes',
  FILE_UPLOAD = 'File Upload',
}

@Entity('scholarship_questions')
export class ScholarshipQuestionEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  label: string;

  @Column({
    type: 'enum',
    enum: QuestionType,
  })
  type: QuestionType;

  @Column({ default: false })
  required: boolean;

  @ManyToOne(() => ScholarshipEntity, (scholarship) => scholarship.questions, {
    onDelete: 'CASCADE',
  })
  scholarship: ScholarshipEntity;

  @OneToMany(() => ScholarshipAnswerEntity, (answer) => answer.question)
  answers: ScholarshipAnswerEntity[];
}
