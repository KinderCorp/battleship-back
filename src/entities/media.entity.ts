import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Media {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  path!: string;
}
