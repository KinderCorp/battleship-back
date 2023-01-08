import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Boat from '@boat/boat.entity';
import BoatRepository from '@boat/boat.repository';
import { CreateBoatDto } from '@dto/boat.dto';
import { InsertedEntity } from '@interfaces/shared.interface';

@Injectable()
export default class BoatService {
  public constructor(
    @InjectRepository(Boat)
    private boatRepository: BoatRepository,
  ) {}

  public async findAll(): Promise<Boat[]> {
    return this.boatRepository.find({});
  }

  public async insert(boat: CreateBoatDto): Promise<InsertedEntity<Boat>> {
    return this.boatRepository.insert(boat);
  }
}
