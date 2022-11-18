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
  id!: string;

  @ManyToOne(() => User, (user: User) => user.id)
  winner!: string;

  @ManyToOne(() => User, (user: User) => user.id)
  loser!: string;

  @CreateDateColumn()
  @Type(() => Date)
  createdAt!: Date;
}
