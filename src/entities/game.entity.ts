import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Type } from 'class-transformer';

import User from '@entities/user.entity';

@Entity()
export default class Game {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @OneToMany(() => User, (user: User) => user.id)
  winner!: string;

  @CreateDateColumn()
  @Type(() => Date)
  createdAt!: Date;
}
