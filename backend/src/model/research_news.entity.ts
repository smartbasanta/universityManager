import { Column, DeleteDateColumn, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { CommentEntity } from './comment.entity';
import { NewsStatus } from 'src/helper/types/index.type';
import { AuthEntity } from './auth.entity';
import { DepartmentEntity } from './department.entity';
// import { DivisionEntity } from './division.entity';
import { StudentEntity } from './student.entity';
import { InstitutionEntity } from './institution.entity';

@Entity('research_news')
export class ResearchNewsEntity extends parentEntity {
  @Column()
  title: string;

  @Column({ type: 'text' })
  abstract: string;

  @Column({
    type: 'json',
    nullable: true,
    comment: 'Stores image metadata (url, alt text, etc)',
  })
  featuredImage: any;

  @Column({ name: 'youtube_url', nullable: true })
  youtubeUrl: string;

  @Column({ type: 'text' })
  article: string;

  @Column()
  category: string;

  @Column({
    type: 'text',
    array: true,
    nullable: true,
    comment: 'List of tags',
  })
  tags: string[];

  @Column({ name: 'paper_link', nullable: true })
  paperLink: string;

  @Column({ type: 'enum', enum: NewsStatus, default: NewsStatus.DRAFT })
  status: NewsStatus;

  @DeleteDateColumn()
  deletedAt?: Date;


  @ManyToOne(() => UniversityEntity, (university) => university.research_news)
  university: UniversityEntity;

  @ManyToOne(
    () => InstitutionEntity,
    (institution) => institution.research_news,
  )
  institution: InstitutionEntity;

  // @OneToMany(() => CommentEntity, (comments) => comments.research_news)
  // comments: CommentEntity[];

  @ManyToOne(() => AuthEntity, (auth) => auth.research_news)
  auth: AuthEntity;

  @ManyToOne(() => DepartmentEntity, (dept) => dept.research_news, {
    onDelete: 'CASCADE',
    nullable: true,
    onUpdate: 'CASCADE',
  })
  department: DepartmentEntity;

  // @ManyToOne(() => DivisionEntity, (division) => division.research_news, {
  //   onDelete: 'CASCADE',
  //   nullable: true,
  //   onUpdate: 'CASCADE',
  // })
  // division: DivisionEntity;

  @OneToMany(()=>CommentEntity, (comment)=> comment.research_news)
  comments: CommentEntity[]
  @ManyToMany(() => StudentEntity, (student) => student.likedResearch)
  likedByStudents: StudentEntity[];
}
