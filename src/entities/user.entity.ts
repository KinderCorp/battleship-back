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
import { ApiProperty } from '@nestjs/swagger';

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
  public id!: string;

  @Column('varchar', { length: USER_PSEUDO_MAX_LENGTH })
  @Length(USER_PSEUDO_MIN_LENGTH, USER_PSEUDO_MAX_LENGTH)
  public pseudo!: string;

  @Column('varchar', { unique: true })
  @IsEmail()
  public email!: string;

  @Column('text')
  @Exclude()
  public password!: string;

  @ApiProperty({
    default: false,
    description: 'If the user account has been confirmed',
  })
  @Column('boolean', { default: false })
  public hasBeenConfirmed!: boolean;

  @ManyToOne(() => Level, (level: Level) => level.id)
  public level!: number;

  @ApiProperty({ default: 0 })
  @Column('integer', { default: 0 })
  public xp!: number;

  @ManyToOne(() => Character, (character: Character) => character.id)
  public character!: number;

  // TASK Review date to be internationalized
  @CreateDateColumn()
  @Type(() => Date)
  public createdAt!: Date;
}
