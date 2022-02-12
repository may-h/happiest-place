import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {ConfigModule} from "@nestjs/config";
import databaseConfig from "../config/database.config";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Connection} from "typeorm";
import {User} from './entity/User.entity';
import {typeORMConfig} from "../config/typeorm.config";
import {UsersModule} from "./user/users.module";
import * as fs from "fs";
import {EmotionModule} from "./modules/emotion/emotion.module";

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
        // ca: fs.readFileSync('/etc/ssl/cert.pem').toString(),
        // rejectUnauthorized: false
        require: true,
        rejectUnauthorized: false
      }
    }),
    UsersModule,
    EmotionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
