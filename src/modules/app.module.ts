import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { EmotionModule } from './emotion/emotion.module';
import { UserModule } from './emotion/user.module';
import { AnalysisModule } from './analysis/analysis.module';
import { ConfigService } from './config';
import { ImageModule } from './image/image.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get('DB_TYPE'),
          host: configService.get('DB_HOST'),
          port: Number(configService.get('DB_PORT')),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/../**/*.entity.{js,ts}'],
          synchronize: configService.get('DB_SYNC') === 'true',
          ssl: {
            require: true,
            rejectUnauthorized: false,
          },
        } as TypeOrmModuleAsyncOptions;
      },
    }),
    ConfigModule,
    // EmotionModule,
    // UserModule,
    // AnalysisModule,
    ImageModule,
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {
  constructor(private connection: Connection) {}
}
