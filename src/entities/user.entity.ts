import * as argon2 from 'argon2';
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Exclude, Type } from 'class-transformer';
import { IsEmail, Length } from 'class-validator';

// TASK Create a base entity to extend

@Entity()
export default class User {
  @PrimaryGeneratedColumn('uuid')
  id: number;

  @Column('varchar', { length: 30 })
  @Length(2, 30)
  pseudo: string;

  @Column('varchar', { unique: true })
  @IsEmail()
  email: string;

  @Column('text', { array: true })
  @Exclude()
  password: string;

  @Column('boolean')
  hasBeenConfirmed: boolean;

  // TASK Add ref to LEVEL
  @Column('string')
  level: string;

  @Column('integer')
  xp: boolean;

  // TASK Add ref to CHARACTER
  @Column('string')
  character: string;

  @CreateDateColumn()
  @Type(() => Date)
  createdAt: Date;

  public async setPassword(password: string): Promise<User> {
    this.password = await argon2.hash(password);
    return this;
  }
}
