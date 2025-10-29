import { Entity, Column, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { StudentEntity } from './student.entity'; // Or a generic User entity
import { ResearchNewsEntity } from './research_news.entity';
import { StaffEntity } from './staff.entity';
import { StudentAmbassadorEntity } from './student_ambassador.entity';

export enum CommentStatus { PENDING = 'pending', APPROVED = 'approved', SPAM = 'spam', HIDDEN = 'hidden' }

@Entity('comments')
export class CommentEntity extends parentEntity {
  @Column({ type: 'text' })
  text: string;

  // Polymorphic Association
  @Column()
  related_entity_id: string;

  @Column()
  related_entity_type: string; // 'research_news', 'blog_post', 'event', etc.

  @Column({ type: 'enum', enum: CommentStatus, default: CommentStatus.PENDING })
  status: CommentStatus;

  @ManyToOne(() => StudentEntity, { nullable: true, onDelete: 'SET NULL' })
  studentAuthor: StudentEntity;

  @ManyToOne(() => StaffEntity, { nullable: true, onDelete: 'SET NULL' })
  staffAuthor: StaffEntity;

  @ManyToOne(() => StudentAmbassadorEntity, { nullable: true, onDelete: 'SET NULL' })
  ambassadorAuthor: StudentAmbassadorEntity;

  @ManyToOne(() => CommentEntity, (comment) => comment.replies, { nullable: true, onDelete: 'CASCADE' })
  parentComment: CommentEntity;

  @OneToMany(() => CommentEntity, (comment) => comment.parentComment)
  replies: CommentEntity[];

  @ManyToOne(() => ResearchNewsEntity, (research) => research.comments, {
    onDelete: 'CASCADE',
  })
  research_news: ResearchNewsEntity;
}