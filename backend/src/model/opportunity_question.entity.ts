import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { OpportunityEntity } from './opportunity.entity';
import { StudentOpportunityAnswerEntity } from './student_opportunity_answer.entity';

export enum QuestionType {
  TEXT = 'Text Input',
  TEXTAREA = 'Textarea',
  SELECT = 'Dropdown',
  FILE = 'File Upload',
}

@Entity('opportunity_questions')
export class OpportunityQuestionEntity {
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

  @ManyToOne(() => OpportunityEntity, (opportunity) => opportunity.questions, {
    onDelete: 'CASCADE',
  })
  opportunity: OpportunityEntity;

  @OneToMany(() => StudentOpportunityAnswerEntity, (ans) => ans.question)
  answers: StudentOpportunityAnswerEntity[];
}
