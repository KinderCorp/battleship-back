import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class LevelEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // TASK Add ref to media entity
  @Column('text')
  image: string;

  @Column('integer')
  rank: number;

  @Column('integer')
  totalXp: number;
}
