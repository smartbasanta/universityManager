import { Column, Entity } from 'typeorm';
import { parentEntity } from './parent.entity';

@Entity('countries')
export class CountryEntity extends parentEntity {
  @Column({ unique: true })
  name: string;

  @Column({ unique: true })
  iso_3166_2: string; // 'AF'

  @Column({ unique: true })
  iso_3166_3: string; // 'AFG'

  @Column({ type:'varchar', nullable: true })
  capital: string | null;

  @Column({ type:'varchar', nullable: true })
  currency: string | null;

  @Column({ type:'varchar', nullable: true })
  currency_symbol: string | null;

  @Column({ type:'varchar', nullable: true })
  region_code: string | null;
  
  @Column({ type:'varchar', nullable: true })
  sub_region_code: string | null;

  @Column({ type:'varchar', nullable: true })
  calling_code: string | null;

  @Column({ type:'varchar', nullable: true })
  flag: string | null;
}
