import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Theme {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public name!: string;
}
