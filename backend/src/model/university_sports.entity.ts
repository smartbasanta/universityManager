import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { SportsTeamEntity } from './sports_team.entity';
import { SportsFacilityEntity } from './sports_facility.entity';

@Entity('university_sports')
export class UniversitySportsEntity extends parentEntity {
  @Column({ nullable: true })
  athletic_division: string; // e.g., 'NCAA Division I'

  @Column({ nullable: true })
  conference: string; // e.g., 'Big Ten Conference'

  @Column({ nullable: true })
  mascot: string;

  @Column({ nullable: true })
  athletic_website: string;

  @OneToOne(() => UniversityEntity, (university) => university.sports, { onDelete: 'CASCADE' })
  university: UniversityEntity;

  @OneToMany(() => SportsTeamEntity, (team) => team.universitySports, { cascade: true })
  teams: SportsTeamEntity[];

  @OneToMany(() => SportsFacilityEntity, (facility) => facility.universitySports, { cascade: true })
  facilities: SportsFacilityEntity[];
}