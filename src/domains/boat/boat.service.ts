import { CreateBoatDto } from '@dto/boat.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Boat from '@boat/boat.entity';
import BoatRepository from '@boat/boat.repository';

@Injectable()
export default class BoatService {
  public constructor(
    @InjectRepository(Boat)
    private boatRepository: BoatRepository,
  ) {}

  public async findAll(): Promise<Boat[]> {
    return this.boatRepository.find({});
  }

  public async insert(boat: CreateBoatDto): Promise<Boat> {
    return this.boatRepository.insert(boat);
  }
}
