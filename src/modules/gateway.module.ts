import { Module } from '@nestjs/common';

import { GameGateway } from '@gateways/gameGateway';

@Module({
  providers: [GameGateway]
})
export class GatewayModule {}
