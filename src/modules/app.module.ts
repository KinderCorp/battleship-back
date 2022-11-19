import { Logger, Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ApiSuccessInterceptor } from '@interceptors/api-success/api-success.interceptor';
import DomainModule from '@modules/domain.module';
import { entities } from '@shared/entities.export';
import { LoggerInterceptor } from '@interceptors/logger/logger.interceptor';

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.local', '.env', '.env.production'],
    }),
    TypeOrmModule.forRoot({
      database: process.env.POSTGRESQL_DATABASE,
      entities: entities,
      host: process.env.POSTGRESQL_HOST,
      password: process.env.POSTGRESQL_PASSWORD,
      port: Number(process.env.POSTGRESQL_PORT),
      synchronize: process.env.POSTGRESQL_HOST === 'localhost',
      type: 'postgres',
      username: process.env.POSTGRESQL_USER,
    }),
    DomainModule,
  ],
  providers: [
    Logger,
    { provide: APP_INTERCEPTOR, useClass: LoggerInterceptor },
    { provide: APP_INTERCEPTOR, useClass: ApiSuccessInterceptor },
  ],
})
export class AppModule {}
