import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import ApiErrorExceptionFilter from '@filters/api-error/api-error-exception.filter';
import { AppModule } from '@modules/app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );

  app.setGlobalPrefix('api');
  app.useGlobalFilters(new ApiErrorExceptionFilter());

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

  await app.listen(process.env.API_PORT);
}
bootstrap();
