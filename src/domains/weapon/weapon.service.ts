import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreateWeaponDto } from '@dto/weapon.dto';
import { InsertedEntity } from '@interfaces/shared.interface';
import Weapon from '@weapon/weapon.entity';
import WeaponRepository from '@weapon/weapon.repository';

@Injectable()
export default class WeaponService {
  public constructor(
    @InjectRepository(Weapon)
    private weaponRepository: WeaponRepository,
  ) {}

  public async findAll(): Promise<Weapon[]> {
    return await this.weaponRepository.find({});
  }

  public async findById(id: number): Promise<Weapon> {
    return await this.weaponRepository.findOneById(id);
  }

  public async insert(
    weapon: CreateWeaponDto,
  ): Promise<InsertedEntity<Weapon>> {
    return this.weaponRepository.insert(weapon);
  }
}
