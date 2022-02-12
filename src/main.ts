import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {NestExpressApplication} from "@nestjs/platform-express";
import {join, resolve} from 'path';
import * as config from 'config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors();
  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('ejs');

  await app.listen(process.env.PORT || 3000, () => {
    console.log(`server listening on port ${process.env.PORT || 3000}`);
  });
}
bootstrap();
