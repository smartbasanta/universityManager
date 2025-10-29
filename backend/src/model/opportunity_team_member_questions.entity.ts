import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OpportunityEntity } from './opportunity.entity';

export enum QuestionType {
  TEXT = 'Text Input',
  TEXTAREA = 'Textarea',
  SELECT = 'Dropdown',
  FILE = 'File Upload',
}

@Entity('opportunity_team_member_questions')
export class OpportunityTeamMemberQuestionEntity {
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

  @ManyToOne(
    () => OpportunityEntity,
    (opportunity) => opportunity.teamMemberQuestions,
    {
      onDelete: 'CASCADE',
    },
  )
  opportunity: OpportunityEntity;
}
