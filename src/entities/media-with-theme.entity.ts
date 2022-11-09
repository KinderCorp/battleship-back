import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MediaWithThemeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  // TASK Add ref to Media
  @Column('text')
  image: string;

  // TASK Add ref to Theme
  @Column('text')
  themeId: string;
}
