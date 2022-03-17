import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication } from '@nestjs/common';
import {
  SWAGGER_API_DESCRIPTION,
  SWAGGER_API_ROOT,
  SWAGGER_API_TITLE,
  SWAGGER_API_VERSION,
} from './constants';

export const initSwagger = (app: INestApplication) => {
  const swaggerConfig = new DocumentBuilder()
    .setTitle(SWAGGER_API_TITLE)
    .setDescription(SWAGGER_API_DESCRIPTION)
    .setVersion(SWAGGER_API_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup(SWAGGER_API_ROOT, app, document);
};
