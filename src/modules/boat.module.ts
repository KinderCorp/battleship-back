import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Boat from '@entities/boat.entity';
import BoatController from '@controllers/boat.controller';
import BoatRepository from '@repositories/boat.repository';
import BoatService from '@services/boat.service';

@Module({
  controllers: [BoatController],
  imports: [TypeOrmModule.forFeature([Boat])],
  providers: [BoatService, BoatRepository],
})
export default class BoatModule {}
