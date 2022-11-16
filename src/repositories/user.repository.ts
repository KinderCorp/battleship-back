import { Injectable } from '@nestjs/common';

import AbstractRepository from '@repositories/abstract.repository';

@Injectable()
export default class UserRepository extends AbstractRepository {}
