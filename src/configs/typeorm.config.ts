import {TypeOrmModuleOptions} from "@nestjs/typeorm";
console.log(process.env.DATABASE_HOST)

export const typeORMConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT) || 5432,
    username: process.env.USERNAME,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    entities: [__dirname + '/../**/*.entity.{js,ts}'],
    synchronize: true,
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
}