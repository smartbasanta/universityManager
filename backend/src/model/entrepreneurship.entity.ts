import { Column, Entity, JoinColumn, OneToMany, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { UniversityEntity } from './university.entity';
import { IncubatorEntity } from './incubator.entity';
import { HackathonEntity } from './hackathon.entity';
import { StartupStoryEntity } from './startup_story.entity';

@Entity('entrepreneurships')
export class EntrepreneurshipEntity extends parentEntity {
  @Column({ type: 'text', nullable: true })
  overall_description: string;

  @Column({ nullable: true })
  entrepreneurship_center_website: string;

  // Note: The OneToMany relationship in the universityEntity would point to this entity
  // This is a correction from the original prompt's ManyToOne
  @OneToOne(() => UniversityEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'university_id' })
  university: UniversityEntity;

  @OneToMany(() => IncubatorEntity, (incubator) => incubator.entrepreneurship, { cascade: true })
  incubators: IncubatorEntity[];

  @OneToMany(() => HackathonEntity, (hackathon) => hackathon.entrepreneurship, { cascade: true })
  hackathons: HackathonEntity[];

  @OneToMany(() => StartupStoryEntity, (story) => story.entrepreneurship, { cascade: true })
  startup_stories: StartupStoryEntity[];
}