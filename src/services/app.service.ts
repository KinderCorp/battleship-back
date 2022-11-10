import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): Record<string, Record<string, string>> {
    return { data: { message: 'Hello world !' } };
  }
}
