import { Column, Entity } from 'typeorm';

@Entity()
export class UserGameEntity {
  // TASK Add ref to Game entity
  @Column('text')
  gameId!: string;

  // TASK Add ref to User entity
  @Column('text')
  userId!: string;
}
