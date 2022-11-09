import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class ThemeEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column('text')
  name!: string;
}
