import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import Weapon from '@weapon/weapon.entity';

@Injectable()
export default class WeaponRepository extends BaseRepository<Weapon> {
  public constructor(
    @InjectRepository(Weapon) private weaponRepository: Repository<Weapon>,
  ) {
    super(weaponRepository);
  }
}
