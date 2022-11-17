import { CreateBoatDto } from '@dto/boat.dto';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import Boat from '@entities/boat.entity';
import BoatRepository from '@repositories/boat.repository';

@Injectable()
export default class BoatService {
  constructor(
    @InjectRepository(Boat)
    private boatRepository: BoatRepository,
  ) {}

  async insert(boat: CreateBoatDto): Promise<Boat> {
    return this.boatRepository.insert(boat);
  }
}
