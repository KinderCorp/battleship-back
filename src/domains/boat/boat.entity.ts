import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

/**
 * INFO Boat dimensions
 * At the moment a boat can have a width greater than 1.
 * But a boat will always have the same length.
 * This could change in the future, a task has been created in ClickUp.
 *
 * Boat terminology : https://www.boaterexam.com/boating-resources/boat-terminology/
 * Boat terminology : https://aceboater.com/en/boating-terminology
 */
@Entity()
export default class Boat {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public name!: string;

  @ApiProperty({ default: 1 })
  @Column('integer', { default: 1 })
  public width!: number;

  @Column('integer')
  public length!: number;
}
