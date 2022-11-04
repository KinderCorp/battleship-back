import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Pizza {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column('text', { array: true })
  ingredient: string[];

  @Column()
  isVegetarian: boolean;
}
