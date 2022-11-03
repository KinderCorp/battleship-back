import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from '@controllers/app.controller';
import { AppService } from '@services/app.service';
import { Pizza } from 'src/entities/pizza.entity';
@Module({
    controllers: [AppController],
    imports: [
        ConfigModule.forRoot(),
        TypeOrmModule.forRoot({
            database: process.env.POSTGRESQL_DATABASE,
            entities: [Pizza],
            host: 'localhost',
            password: process.env.POSTGRESQL_PASSWORD,
            port: 5432,
            // TASK Below should be set to false in production
            synchronize: true,
            type: 'postgres',
            username: process.env.POSTGRESQL_USER,
        }),
    ],
    providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
