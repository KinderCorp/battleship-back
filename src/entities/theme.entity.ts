import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Theme {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;
}
