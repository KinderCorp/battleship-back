import {
  GameEngineErrorCodes,
  GameEngineErrorMessages,
} from '@interfaces/error.interface';
import Boat from '@boat/boat.entity';
import { BoatName } from '@interfaces/boat.interface';
import BoatService from '@boat/boat.service';
import GameEngineError from '@shared/game-engine-error';

export default class BoatStore {
  private _boats: Boat[];

  public constructor(private boatService: BoatService) {
    this.initialise();
  }

  public get boats(): Boat[] {
    return this._boats;
  }

  public getByName(boatName: BoatName) {
    const boat = this.boats.find((boat) => boat.name === boatName);

    if (!boat) {
      const errorKey = 'INVALID_BOAT';

      throw new GameEngineError({
        code: GameEngineErrorCodes[errorKey],
        message: GameEngineErrorMessages[errorKey],
      });
    }

    return boat;
  }
  private async initialise() {
    this._boats = await this.boatService.findAll();
  }
}
