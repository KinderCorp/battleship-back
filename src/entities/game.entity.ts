import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

import User from '@entities/user.entity';

@Entity()
export default class Game {
  @PrimaryGeneratedColumn('uuid')
  public id!: string;

  @ManyToOne(() => User, (user: User) => user.id)
  public winner!: string;

  @ManyToOne(() => User, (user: User) => user.id)
  public loser!: string;

  @CreateDateColumn()
  @Type(() => Date)
  public createdAt!: Date;
}
