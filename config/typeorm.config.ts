import {TypeOrmModuleOptions} from "@nestjs/typeorm";
import * as config from 'config';
import {ConfigService} from "@nestjs/config";

const dbconfig = new ConfigService()
console.log(process.env.DATABASE_HOST)
console.log(dbconfig.get('database.host'))

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'mysql',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 3306,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
}