import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { StudentOrganizationEntity } from './student_organization.entity';
import { UniversityTraditionEntity } from './university_tradition.entity';

@Entity('university_students_life')
export class UniversityStudentLifeEntity extends parentEntity {
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', nullable: true })
  number_of_organizations: number;

  @OneToOne(() => UniversityEntity, (university) => university.student_life, { onDelete: 'CASCADE' })
  university: UniversityEntity;

  @OneToMany(() => StudentOrganizationEntity, (org) => org.studentLife, { cascade: true })
  organizations: StudentOrganizationEntity[];

  @OneToMany(() => UniversityTraditionEntity, (tradition) => tradition.studentLife, { cascade: true })
  traditions: UniversityTraditionEntity[];
}