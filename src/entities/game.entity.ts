import {
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

import User from '@entities/user.entity';

@Entity()
export default class Game {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => User, (user: User) => user.id)
  @JoinColumn()
  winner!: string;

  @CreateDateColumn()
  @Type(() => Date)
  createdAt!: Date;
}
