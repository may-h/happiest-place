import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import databaseConfig from "../config/database.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {EmotionModule} from "./modules/emotion/emotion.module";
import {UserModule} from "./modules/emotion/user.module";
import {AnalysisModule} from "./modules/emotion/analysis.module";
import {typeORMConfig} from "./configs/typeorm.config";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig]
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST,
      port: Number(process.env.DATABASE_PORT) || 3306,
      username: process.env.USERNAME,
      password: process.env.PASSWORD,
      database: process.env.DATABASE,
      entities: [__dirname + '/../**/*.entity.{js,ts}'],
      synchronize: true,
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }),
    EmotionModule,
    UserModule,
    AnalysisModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
