import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
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
import { IdentifierInterface } from '@interfaces/entity.interface';
import Level from '@entities/level.entity';

@Entity()
export default class User implements IdentifierInterface {
  @PrimaryGeneratedColumn('uuid')
  @OneToMany(() => Game, (game: Game) => game.winner)
  @OneToMany(() => Game, (game: Game) => game.loser)
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

  @ManyToOne(() => Level, (level: Level) => level.id)
  level!: number;

  @Column('integer', { default: 0 })
  xp!: number;

  @ManyToOne(() => Character, (character: Character) => character.id)
  character!: number;

  // TASK Review date to be internationalized
  @CreateDateColumn()
  @Type(() => Date)
  createdAt!: Date;
}
