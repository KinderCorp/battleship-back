import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class Media {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public path!: string;
}
