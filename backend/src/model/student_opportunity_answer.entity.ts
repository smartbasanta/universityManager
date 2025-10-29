import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { StudentEntity } from './student.entity';
import { OpportunityQuestionEntity } from './opportunity_question.entity';
import { parentEntity } from './parent.entity';

@Entity('student_opportunity_answers')
export class StudentOpportunityAnswerEntity extends parentEntity {
  @ManyToOne(() => StudentEntity, (student) => student.answers)
  student: StudentEntity;

  @ManyToOne(() => OpportunityQuestionEntity, (question) => question.answers)
  question: OpportunityQuestionEntity;

  @Column()
  answer: string;
}
