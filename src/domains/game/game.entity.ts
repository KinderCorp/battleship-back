import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

import { GameType } from '@interfaces/game.interface';
import User from '@user/user.entity';

@Entity()
export default class Game implements GameType {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => User, (user: User) => user.id)
  public winner: User['id'];

  @ManyToOne(() => User, (user: User) => user.id)
  public loser: User['id'];

  @CreateDateColumn()
  @Type(() => Date)
  public createdAt!: Date;
}
