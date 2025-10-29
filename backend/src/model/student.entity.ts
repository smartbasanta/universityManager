import {
  Column,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { parentEntity } from './parent.entity';
import { AuthEntity } from './auth.entity';
import { CommentEntity } from './comment.entity';
import { ReviewEntity } from './review.entity';
import { BookingEntity } from './booking.entity';
import { ResearchNewsEntity } from './research_news.entity';
import { StudentOpportunityAnswerEntity } from './student_opportunity_answer.entity';
import { JobAnswerEntity } from './job_answer.entity';
import { ScholarshipAnswerEntity } from './scholarship_answer.entity';
import { UniversityEntity } from './university.entity';
import { ProgramEntity } from './program.entity';

@Entity('students')
export class StudentEntity extends parentEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  photo: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ type:'date', nullable: true })
  date_of_birth: Date;

  @Column({ type: 'int', nullable: true })
  enrollmentYear: number;

  @Column({ type: 'int', nullable: true })
  graduationYear: number;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToOne(() => AuthEntity, (auth) => auth.student, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'authId' })
  auth: AuthEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.studentAuthor)
  comments: CommentEntity[];

  @OneToMany(() => ReviewEntity, (review) => review.student)
  reviews: ReviewEntity[];

  @OneToMany(() => BookingEntity, (booking) => booking.student)
  bookings: BookingEntity[];

  @ManyToMany(
    () => ResearchNewsEntity,
    (research) => research.likedByStudents,
    {
      cascade: true,
    },
  )
  @JoinTable({
    name: 'student_likes_research', // Custom join table name
    joinColumn: {
      name: 'student_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'research_id',
      referencedColumnName: 'id',
    },
  })
  likedResearch: ResearchNewsEntity[];

  @OneToMany(() => StudentOpportunityAnswerEntity, (ans) => ans.student)
  answers: StudentOpportunityAnswerEntity[];

  @OneToMany(() => JobAnswerEntity, (ans) => ans.student)
  jobAnswers: JobAnswerEntity[];

  @OneToMany(() => ScholarshipAnswerEntity, (ans) => ans.student)
  scholarshipAnswers: ScholarshipAnswerEntity[];

  @ManyToOne(() => UniversityEntity, (university) => university.students)
  university: UniversityEntity;

  @ManyToOne(() => ProgramEntity, (program) => program.students)
  program: ProgramEntity; // The student's current major/program
}
