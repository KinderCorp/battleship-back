import BoatService from '@boat/boat.service';
import { Module } from '@nestjs/common';

import BoatStore from '@store/boat.store';
import DomainModule from '@modules/domain.module';
import GameApi from '@gateways/game-api';
import GameEngine from '@engine/game-engine';
import GameEngineValidatorsService from '@engine/game-engine-validators.service';
import GameGateway from '@gateways/game-gateway';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

const boatStoreProvider = {
  inject: [BoatService],
  provide: 'BOAT_STORE',
  useFactory: async (boatService: BoatService) => {
    return new BoatStore(boatService);
  },
};

@Module({
  imports: [DomainModule],
  providers: [
    boatStoreProvider,
    GameEngine,
    GameEngineValidatorsService,
    GameGateway,
    GameInstanceValidatorsService,
    GameApi,
  ],
})
export default class GatewayModule {}
