import {
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

import Media from '@media/media.entity';
import Theme from '@theme/theme.entity';

@Entity()
export default class MediaWithTheme {
  @PrimaryGeneratedColumn()
  public id!: number;

  @OneToOne(() => Media, (media: Media) => media.id)
  @JoinColumn()
  public media!: number;

  @ManyToOne(() => Theme, (theme: Theme) => theme.id)
  @JoinColumn()
  public theme!: number;
}
