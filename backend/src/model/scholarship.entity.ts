import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { ScholarshipQuestionEntity } from './scholarship_question.entity';
import { InstitutionEntity } from './institution.entity';
import { DepartmentEntity } from './department.entity';
import { AuthEntity } from './auth.entity';

@Entity('scholarships')
export class ScholarshipEntity extends parentEntity {
  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  amount: number;

  @Column({ type: 'date', nullable: true })
  deadline: Date;

  @Column({ type: 'text', nullable: true })
  eligibility_criteria: string;

  @Column({ nullable: true })
  website: string;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  applicationCount: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => AuthEntity, (auth) => auth.scholarship, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  auth: AuthEntity;

  @ManyToOne(() => UniversityEntity, (university) => university.scholarships, { onDelete: 'CASCADE' })
  university: UniversityEntity;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.scholarships, { onDelete: 'CASCADE' })
  institution: InstitutionEntity;

  @ManyToOne(() => DepartmentEntity, (department) => department.scholarships, { onDelete: 'CASCADE' })
  department: DepartmentEntity;

  @OneToMany(() => ScholarshipQuestionEntity, (q) => q.scholarship, {
    cascade: true,
    eager: true,
  })
  questions: ScholarshipQuestionEntity[];

}