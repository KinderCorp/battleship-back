import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class CharacterEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // TASK Add ref to Media entity
  @Column('text')
  media: string;

  // TASK Add ref to Level entity
  @Column('text')
  requiredLevel: string;
}
