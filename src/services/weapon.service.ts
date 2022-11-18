import { CreateWeaponDto } from '@dto/weapon.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Weapon from '@entities/weapon.entity';
import WeaponRepository from '@repositories/weapon.repository';

@Injectable()
export default class WeaponService {
  public constructor(
    @InjectRepository(Weapon)
    private weaponRepository: WeaponRepository,
  ) {}

  public async insert(weapon: CreateWeaponDto): Promise<Weapon> {
    return this.weaponRepository.insert(weapon);
  }
}
