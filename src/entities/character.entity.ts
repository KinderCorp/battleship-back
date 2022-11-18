import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Level from '@entities/level.entity';
import Media from '@entities/media.entity';
import User from '@entities/user.entity';

@Entity()
export default class Character {
  @OneToMany(() => User, (user: User) => user.character)
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  media!: number;

  @ManyToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  requiredLevel!: number;
}
