import { IdentifierInterface } from '@interfaces/entity.interface';

export enum BoatName {
  FRIGATE = 'frigate',
  GALLEY = 'galley',
  RAFT = 'raft',
  SHALLOP = 'shallop',
}

export interface BoatType extends IdentifierInterface {
  id: number;
  name: BoatName;
  width: number;
  length: number;
}
