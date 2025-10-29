import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityStudentLifeEntity } from './university_student_life.entity';

@Entity('student_organizations')
export class StudentOrganizationEntity extends parentEntity {
  @Column()
  name: string;

  @Column()
  category: string; // e.g., 'Academic', 'Cultural', 'Service', 'Arts'

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  website_or_social_media: string;

  @Column({ nullable: true })
  contact_email: string;

  @ManyToOne(() => UniversityStudentLifeEntity, (life) => life.organizations, { onDelete: 'CASCADE' })
  studentLife: UniversityStudentLifeEntity;
}