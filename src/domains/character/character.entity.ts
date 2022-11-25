import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Level from '@level/level.entity';
import Media from '@media/media.entity';
import User from '@user/user.entity';

@Entity()
export default class Character {
  @OneToMany(() => User, (user: User) => user.character)
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  public media!: number;

  @ManyToOne(() => Level, (level: Level) => level.id)
  public requiredLevel!: number;
}
