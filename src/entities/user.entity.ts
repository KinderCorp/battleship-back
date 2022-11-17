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

import {
  USER_PSEUDO_MAX_LENGTH,
  USER_PSEUDO_MIN_LENGTH,
} from '@shared/entity.const';
import Character from '@entities/character.entity';
import Game from '@entities/game.entity';
import { IdentifierInterface } from '@entities/entity.interface';
import Level from '@entities/level.entity';

@Entity()
export default class User implements IdentifierInterface {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column('varchar', { length: USER_PSEUDO_MAX_LENGTH })
  @Length(USER_PSEUDO_MIN_LENGTH, USER_PSEUDO_MAX_LENGTH)
  pseudo!: string;

  @Column('varchar', { unique: true })
  @IsEmail()
  email!: string;

  @Column('text')
  @Exclude()
  password!: string;

  @Column('boolean', { default: false })
  hasBeenConfirmed!: boolean;

  @OneToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  level!: number;

  @Column('integer')
  xp!: number;

  @OneToOne(() => Character, (character: Character) => character.id)
  @JoinColumn()
  character!: number;

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
