import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversitySportsEntity } from './university_sports.entity';
import { TeamAchievementEntity } from './team_achievement.entity'; // Import the new entity

export enum GenderCategory {
  MENS = "men's",
  WOMENS = "women's",
  COED = 'co-ed',
}

@Entity('sports_teams')
export class SportsTeamEntity extends parentEntity {
  @Column()
  sport_name: string; // e.g., 'Basketball', 'Football', 'Swimming'

  @Column({ type: 'enum', enum: GenderCategory })
  gender: GenderCategory;

  @Column({ nullable: true })
  head_coach: string;

  @Column({ nullable: true })
  team_website_url: string;

  @ManyToOne(() => UniversitySportsEntity, (sports) => sports.teams, { onDelete: 'CASCADE' })
  universitySports: UniversitySportsEntity;

  @OneToMany(() => TeamAchievementEntity, (achievement) => achievement.team, { cascade: true })
  achievements: TeamAchievementEntity[]; // New relationship
}