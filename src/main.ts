import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@modules/app.module';
import { Logger } from '@nestjs/common';

const logger = new Logger();

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.enableCors();
  app.setGlobalPrefix('api');

  // FIXME Later to have better errors
  // app.useGlobalFilters(new ApiErrorExceptionFilter());

  const config = new DocumentBuilder()
    .setTitle('BattleShip')
    .setDescription('The BattleShip game API description')
    .setVersion('1.0')
    .setExternalDoc(
      'Nestjs Swagger Decorators',
      'https://docs.nestjs.com/openapi/decorators',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.API_PORT, async () => {
    logger.log(`
    *********************************************************** 
    |  🛫 The API is listening on ${await app.getUrl()}/api/  |
    |                          –––                            |
    |  📚 Swagger available on ${await app.getUrl()}/docs     |
    ***********************************************************
    `);
  });
}
bootstrap();
