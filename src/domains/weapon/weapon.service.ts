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

  public async findByName(name: Weapon['name']): Promise<Weapon> {
    // ASK To Kevin how to return requiredLevel explicitly without Level entity
    return await this.weaponRepository.findOne({
      relations: { requiredLevel: true },
      where: { name: name },
    });
  }

  public async insert(
    weapon: CreateWeaponDto,
  ): Promise<InsertedEntity<Weapon>> {
    return this.weaponRepository.insert(weapon);
  }
}
