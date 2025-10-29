import { Entity, Column, OneToMany, ManyToOne, DeleteDateColumn } from 'typeorm';
import { parentEntity } from './parent.entity';
import { JobQuestionEntity } from './job_question.entity';
import { UniversityEntity } from './university.entity';
import { AuthEntity } from './auth.entity';
import { DepartmentEntity } from './department.entity';
import { InstitutionEntity } from './institution.entity';
// import { DivisionEntity } from './division.entity';

export enum EmploymentType {
  FULL_TIME = 'Full-time',
  PART_TIME = 'Part-time',
  INTERNSHIP = 'Internship',
  CONTRACT = 'Contract',
  TEMPORARY = 'Temporary',
}

export enum ExperienceLevel {
  ENTRY = 'Entry Level',
  MID = 'Mid Level',
  SENIOR = 'Senior Level',
  EXECUTIVE = 'Executive',
}

export enum JobStatus {
  DRAFT = 'Draft',
  ARCHIVE = 'Archive',
  LIVE = 'Live',
}

export enum ModeOfWork {
  ONSITE = 'Onsite',
  ONLINE = 'Online',
  HYBRID = 'Hybrid',
}

@Entity('jobs')
export class JobEntity extends parentEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  location: string;

  @Column({ type: 'enum', enum: EmploymentType })
  employmentType: EmploymentType;

  @Column({ type: 'enum', enum: ExperienceLevel })
  experienceLevel: ExperienceLevel;

  @Column({ type: 'enum', enum: ModeOfWork })
  modeOfWork: ModeOfWork;

  @Column({ default: false })
  hasApplicationForm: boolean;

  @Column({ type: 'int', default: 0 })
  viewCount: number;

  @Column({ type: 'int', default: 0 })
  applicationCount: number;

  @Column({ type: 'enum', enum: JobStatus, default: JobStatus.DRAFT })
  status: JobStatus;

  @DeleteDateColumn()
  deletedAt?: Date;

  // closing date column can be considered

  @ManyToOne(() => AuthEntity, (auth) => auth.jobs, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  auth: AuthEntity;

  @OneToMany(() => JobQuestionEntity, (q) => q.job, {
    cascade: true,
    eager: true,
  })
  questions: JobQuestionEntity[];

  @ManyToOne(() => UniversityEntity, (university) => university.jobs)
  university: UniversityEntity;

  @ManyToOne(() => InstitutionEntity, (institution) => institution.jobs)
  institution: InstitutionEntity;

  // @ManyToOne(() => AuthEntity, (auth) => auth.jobs)
  // auth: AuthEntity;

  @ManyToOne(() => DepartmentEntity, (dept) => dept.jobs, {
    onDelete: 'CASCADE',
    nullable: true,
    onUpdate: 'CASCADE',
  })
  department: DepartmentEntity;

  // @ManyToOne(() => DivisionEntity, (division) => division.jobs, {
  //   onDelete: 'CASCADE',
  //   nullable: true,
  //   onUpdate: 'CASCADE',
  // })
  // division: DivisionEntity;
}
