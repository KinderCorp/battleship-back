import { Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';

import Level from '@entities/level.entity';
import Media from '@entities/media.entity';

@Entity()
export default class Character {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  media!: number;

  @OneToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  requiredLevel!: number;
}
