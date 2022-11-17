import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import Weapon from '@entities/weapon.entity';
import WeaponController from '@controllers/weapon.controller';
import WeaponRepository from '@repositories/weapon.repository';
import WeaponService from '@services/weapon.service';

@Module({
  controllers: [WeaponController],
  imports: [TypeOrmModule.forFeature([Weapon])],
  providers: [WeaponService, WeaponRepository],
})
export default class WeaponModule {}
