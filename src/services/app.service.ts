import { HttpStatus, Injectable } from '@nestjs/common';

import ApiError from '@shared/api-error';
import { ErrorCodes } from '@interfaces/error.interface/error.interface';

@Injectable()
export class AppService {
  getHello(lang?: string): Record<string, string> {
    if (lang === 'fr') {
      return {
        data: 'bonjour',
      };
    }

    if (lang === 'ru') {
      throw new ApiError({
        code: ErrorCodes.WRONG_PARAMS,
        detail:
          'This error is just a test, do not worry about it. You can rest safely tonight.',
        instance: this.constructor.name,
        status: HttpStatus.FOUND,
        title: 'Self-triggered error',
      });
    }

    return { data: 'Hello world !' };
  }
}
