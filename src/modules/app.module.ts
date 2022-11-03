import { Module } from '@nestjs/common';

import { AppController } from '@controllers/app.controller';
import { AppService } from '@services/app.service';

@Module({
    controllers: [AppController],
    imports: [],
    providers: [AppService],
})
export class AppModule {}
