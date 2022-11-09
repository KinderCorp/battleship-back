import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class WeaponEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  // TASK Add ref to Level
  @Column('text')
  requiredLevel: string;

  // TASK Add ref to Media
  @Column('text')
  media: string;

  @Column({ nullable: true, type: 'integer' })
  maxAmmunition: null | number;

  @Column('array')
  damage: number[][];
}
