import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  DeleteDateColumn,
} from 'typeorm';
import { OpportunityQuestionEntity } from './opportunity_question.entity';
import { UniversityEntity } from './university.entity';
import { OpportunityTeamMemberQuestionEntity } from './opportunity_team_member_questions.entity';
import { DepartmentEntity } from './department.entity';
import { InstitutionEntity } from './institution.entity';
// import { DivisionEntity } from './division.entity';
import { AuthEntity } from './auth.entity';

export enum OpportunityType {
  BOOTCAMP = 'Bootcamp',
  RESEARCH = 'Research',
  SYMPOSIUM = 'Symposium',
  STARTUP = 'Startup',
  INCUBATION = 'Incubation',
  COMPETITION = 'Competition',
  HACKATHON = 'Hackathon',
  OTHER = 'Other',
}

export enum OpportunityLocation {
  VIRTUAL = 'Virtual',
  IN_PERSON = 'In-person',
  HYBRID = 'Hybrid',
}
export enum OpportunityStatus {
  DRAFT = 'Draft',
  ARCHIVE = 'Archive',
  LIVE = 'Live',
}

export enum OpportunityScope {
  UNIVERSITY = 'university',
  INSTITUTION = 'institution',
  DEPARTMENT = 'department',
}

@Entity('opportunities')
export class OpportunityEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({
    type: 'enum',
    enum: OpportunityType,
  })
  type: OpportunityType;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: OpportunityLocation,
  })
  location: OpportunityLocation;

  @Column({ type: 'varchar', nullable: true })
  educationalLevel: string;

  @Column({ nullable: true })
  venue: string;

  @Column({ type: 'timestamptz' })
  startDateTime: Date;

  @Column({ type: 'timestamptz' })
  endDateTime: Date;

  @Column()
  applicationLink: string;

  @Column({ type: 'text', array: true, nullable: true })
  tags: string[];

  @Column({
    default: false,
    comment: 'If true, custom application questions are enabled',
  })
  hasApplicationForm: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  applicationCount: number;

  @Column({
    type: 'enum',
    enum: OpportunityScope,
    nullable: true
  })
  scope: OpportunityScope;

  @DeleteDateColumn()
  deletedAt?: Date;


  @OneToMany(() => OpportunityQuestionEntity, (q) => q.opportunity, {
    cascade: true,
    eager: true,
  })
  questions: OpportunityQuestionEntity[];

  @OneToMany(() => OpportunityTeamMemberQuestionEntity, (q) => q.opportunity, {
    cascade: true,
    eager: true,
  })
  teamMemberQuestions: OpportunityTeamMemberQuestionEntity[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({
    type: 'enum',
    enum: OpportunityStatus,
    default: OpportunityStatus.DRAFT,
  })
  status: OpportunityStatus;

  @ManyToOne(() => UniversityEntity, (university) => university.opportunity, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  university: UniversityEntity;

  @ManyToOne(
    () => InstitutionEntity,
    (institution) => institution.opportunity,
    {
      onDelete: 'CASCADE',
      nullable: true,
    },
  )
  institution: InstitutionEntity;

  // @ManyToOne(() => DivisionEntity, (division) => division.opportunity, {
  //   onDelete: 'CASCADE',
  //   nullable: true,
  // })
  // division: DivisionEntity;

  @ManyToOne(() => DepartmentEntity, (dept) => dept.opportunities, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  department: DepartmentEntity;

  @ManyToOne(() => AuthEntity, (auth) => auth.opportunity, {
    onDelete: 'CASCADE',
    nullable: true,
  })
  auth: AuthEntity;
}
