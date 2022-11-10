import * as argon2 from 'argon2';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';

import Character from '@entities/character.entity';
import Game from '@entities/game.entity';
import Level from '@entities/level.entity';

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id!: number;

  @Column('varchar', { length: 30 })
  @Length(2, 30)
  pseudo!: string;

  @Column('varchar', { unique: true })
  @IsEmail()
  email!: string;

  @Column('text')
  @Exclude()
  password!: string;

  @Column('boolean')
  hasBeenConfirmed!: boolean;

  @OneToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  level!: string;

  @Column('integer')
  xp!: boolean;

  @OneToOne(() => Character, (character: Character) => character.id)
  @JoinColumn()
  character!: string;

  @JoinTable({ name: 'user_game' })
  @ManyToMany(() => Game, (game: Game) => game.id)
  games: Game[];

  @CreateDateColumn()
  @Type(() => Date)
  createdAt!: Date;

  public async setPassword(password: string): Promise<User> {
    this.password = await argon2.hash(password);
    return this;
  }
}
