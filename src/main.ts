import {
    FastifyAdapter,
    NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { NestFactory } from '@nestjs/core';

import { AppModule } from '@modules/app.module';

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(
        AppModule,
        new FastifyAdapter(),
    );
    await app.listen(3000);
}
bootstrap();
