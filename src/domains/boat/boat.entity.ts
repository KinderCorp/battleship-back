import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

import { BoatName, BoatType } from '@interfaces/boat.interface';

/**
 * At the moment a boat can have a width greater than 1.
 * But a boat will always have the same length.
 * This could change in the future, a task has been created in ClickUp.
 *
 * Boat terminology : https://www.boaterexam.com/boating-resources/boat-terminology/
 * Boat terminology : https://aceboater.com/en/boating-terminology
 */
@Entity()
export default class Boat implements BoatType {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('text')
  public name!: BoatName;

  @ApiProperty({ default: 1 })
  @Column('integer', { default: 1 })
  public beam!: number;

  @Column('integer')
  public lengthOverall!: number;
}
