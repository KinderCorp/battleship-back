import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import User from '@user/user.entity';
import Weapon from '@weapon/weapon.entity';

@Entity()
export default class Level {
  @OneToMany(() => Weapon, (weapon: Weapon) => weapon.requiredLevel)
  @OneToMany(() => User, (user: User) => user.level)
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('integer')
  public rank!: number;

  @Column('integer')
  public totalXp!: number;
}
