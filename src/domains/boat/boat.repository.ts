import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import BaseRepository from '@base/base.repository';
import Boat from '@boat/boat.entity';

@Injectable()
export default class BoatRepository extends BaseRepository<Boat> {
  public constructor(
    @InjectRepository(Boat) private boatRepository: Repository<Boat>,
  ) {
    super(boatRepository);
  }
}
