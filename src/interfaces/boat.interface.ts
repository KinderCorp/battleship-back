import { IdentifierInterface } from '@interfaces/entity.interface';

export enum BoatName {
  FRIGATE = 'frigate',
  GALLEY = 'galley',
  RAFT = 'raft',
  SHALLOP = 'shallop',
}

/**
 * @description Field definitions
 * @property {number} id The identifier
 * @property {BoatName} name The unique name of the boat
 * @property {number} beam The width of the boat
 * @property {number} lengthOverall The overall length of the boat
 */
export interface BoatType extends IdentifierInterface {
  id: number;
  name: BoatName;
  beam: number;
  lengthOverall: number;
}
