import { Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import Level from '@level/level.entity';
import User from '@user/user.entity';

@Entity()
export default class Character {
  @OneToMany(() => User, (user: User) => user.character)
  @PrimaryGeneratedColumn()
  public id!: number;

  @ManyToOne(() => Level, (level: Level) => level.id)
  public requiredLevel!: number;
}
