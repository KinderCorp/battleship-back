import GameEngineValidatorsService from '@engine/game-engine-validators.service';
import { Module } from '@nestjs/common';

import GameEngine from '@engine/game-engine';
import { GameGateway } from '@gateways/gameGateway';
import GameInstanceValidatorsService from '@engine/game-instance-validators.service';

@Module({
  providers: [
    GameEngine,
    GameEngineValidatorsService,
    GameGateway,
    GameInstanceValidatorsService,
  ],
})
export class GatewayModule {}
