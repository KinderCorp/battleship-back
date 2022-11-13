import { HttpStatus, Injectable } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { ErrorCodes } from '@interfaces/error.interface/error.interface';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello world !';
  }
}
