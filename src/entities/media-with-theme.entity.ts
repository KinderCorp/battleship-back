import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Media from '@entities/media.entity';
import Theme from '@entities/theme.entity';

// TASK Add APi Property for swagger

@Entity()
export default class MediaWithTheme {
  @PrimaryGeneratedColumn()
  id!: number;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  media!: number;

  @ManyToOne(() => Theme, (theme: Theme) => theme.id)
  @JoinColumn()
  theme!: number;
}
