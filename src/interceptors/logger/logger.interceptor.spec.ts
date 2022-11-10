import {
  Logger,
  LoggerService,
} from '@nestjs/common';
import { LoggerInterceptor } from './logger.interceptor';

describe('LoggerInterceptor', () => {
  it('should be defined', () => {
    const logger: LoggerService = Logger;
    expect(new LoggerInterceptor(logger)).toBeDefined();
  });
});
