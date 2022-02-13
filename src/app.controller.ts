import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Render,
  UploadedFiles,
  UseInterceptors
} from '@nestjs/common';
import { AppService } from './app.service';
import {ConfigService} from "@nestjs/config";
import {FilesInterceptor} from "@nestjs/platform-express";
import {diskStorage} from "multer";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private configService: ConfigService) {}

  @Get()
  @Render('index')
  root() {
    console.log(this.configService.get('database.host'));
    console.log(this.configService.get('DATABASE_HOST'));
    return { title: 'Happiest Place 🧳' };
  }

  @Post('test')
  @UseInterceptors(FilesInterceptor('files', 10, {
    fileFilter: (request, file, callback) => {
      if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {  // 이미지 형식은 jpg, jpeg, png만 허용
        callback(null, true);
      } else {
        callback(
            new HttpException(
                {
                  message: 1,
                  error: '지원하지 않는 이미지 형식입니다.',
                },
                HttpStatus.BAD_REQUEST,
            ),
            false,
        );
      }
    },
    limits: {
      fieldNameSize: 200, // 필드명 사이즈 최대값 (기본값 100bytes)
      fieldSize: 1024 * 1024, // 필드 사이즈 값 설정 (기본값 1MB)
      fields: 2, // 파일 형식이 아닌 필드의 최대 개수 (기본 값 무제한)
      fileSize: 16777216, //multipart 형식 폼에서 최대 파일 사이즈(bytes) "16MB 설정" (기본 값 무제한)
      files: 10, //multipart 형식 폼에서 파일 필드 최대 개수 (기본 값 무제한)
    },
  }))
  async emotion(@UploadedFiles() files: Array<Express.Multer.File>, @Body('user_id') userId: number) {
    return await this.appService.run(files, userId);
  }
}
