import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import {
  DamageMatrix,
  WeaponName,
  WeaponType,
} from '@interfaces/weapon.interface';
import Level from '@level/level.entity';

@Entity()
export default class Weapon implements WeaponType {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({ enum: WeaponName, type: 'enum', unique: true })
  public name!: WeaponName;

  @ManyToOne(() => Level, (level: Level) => level.id)
  @JoinColumn()
  public requiredLevel!: Level['id'];

  @ApiProperty({
    default: -1,
    description:
      'Specifies the maximum amount of ammunition. Default to -1 for infinite ammunition',
  })
  @Column({ default: -1, type: 'integer' })
  public maxAmmunition: number;

  @Column('json')
  public damageArea: DamageMatrix;
}
