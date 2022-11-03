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
        ConfigModule.forRoot({
            envFilePath: ['.env.local', '.env', '.env.production'],
        }),
        TypeOrmModule.forRoot({
            database: process.env.POSTGRESQL_DATABASE,
            entities: [Pizza],
            host: process.env.POSTGRESQL_HOST,
            password: process.env.POSTGRESQL_PASSWORD,
            port: Number(process.env.POSTGRESQL_PORT),
            synchronize: process.env.POSTGRESQL_HOST === 'localhost',
            type: 'postgres',
            username: process.env.POSTGRESQL_USER,
        }),
    ],
    providers: [AppService],
})
export class AppModule {
    constructor(private dataSource: DataSource) {}
}
