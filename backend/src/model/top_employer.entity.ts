import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { CareerOutcomesEntity } from './career_outcomes.entity';

@Entity('top_employers')
export class TopEmployerEntity extends parentEntity {
  @Column()
  company_name: string;

  @Column({ nullable: true })
  industry: string;

  @Column({ nullable: true })
  company_website: string;

  @ManyToOne(() => CareerOutcomesEntity, (outcomes) => outcomes.top_employers, { onDelete: 'CASCADE' })
  careerOutcomes: CareerOutcomesEntity;
}