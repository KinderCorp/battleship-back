import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export default class MediaEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  image!: string;
}
