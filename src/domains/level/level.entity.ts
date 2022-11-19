import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Media from '@media/media.entity';
import User from '@user/user.entity';
import Weapon from '@weapon/weapon.entity';

@Entity()
export default class Level {
  @OneToMany(() => Weapon, (weapon: Weapon) => weapon.requiredLevel)
  @OneToMany(() => User, (user: User) => user.level)
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  public media!: number;

  @Column('integer')
  public rank!: number;

  @Column('integer')
  public totalXp!: number;
}
