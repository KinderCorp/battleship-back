import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class BoatEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  name: string;

  // TASK Add ref to mediaWithTheme entity
  @Column('array')
  images: string[];

  @Column('integer')
  width: number;

  @Column('integer')
  length: number;
}
