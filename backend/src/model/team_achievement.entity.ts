import { Column, Entity, ManyToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { SportsTeamEntity } from './sports_team.entity';

@Entity('team_achievements')
export class TeamAchievementEntity extends parentEntity {
  @Column({ type: 'int' })
  year: number; // e.g., 2024

  @Column()
  achievement: string; // e.g., 'Conference Champions', 'NCAA Tournament Appearance', 'National Champions'

  @Column({ type: 'text', nullable: true })
  description: string; // Optional field for more details

  @ManyToOne(() => SportsTeamEntity, (team) => team.achievements, { onDelete: 'CASCADE' })
  team: SportsTeamEntity;
}