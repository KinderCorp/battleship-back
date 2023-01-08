import { GamePreset, PresetName } from '@interfaces/engine.interface';
import { BoatName } from '@interfaces/boat.interface';

export const classicGame: GamePreset = {
  fleetPreset: [
    [4, BoatName.RAFT],
    [3, BoatName.SHALLOP],
    [2, BoatName.FRIGATE],
    [1, BoatName.GALLEY],
  ],
  name: PresetName.CLASSIC,
};
