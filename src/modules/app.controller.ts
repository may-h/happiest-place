import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Render,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image/image.service';
import { AnalysisService } from './analysis/analysis.service';
import { GenerateFilenamePipe } from './generate-filename.pipe';
import { extractExifPipe } from './extract-exif.pipe';
import { AppService } from './app.service';
// import { AppService } from './app.service';
// import { ConfigService } from '@nestjs/config';
// import { FilesInterceptor } from '@nestjs/platform-express';
// import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly imageService: ImageService,
    private readonly analysisService: AnalysisService,
  ) {}

  @Get()
  @Render('index')
  root() {
    return { title: 'Happiest Place 🧳' };
  }

  @Post('api/analyzeEmotion')
  @Render('map')
  @UseInterceptors(
    FilesInterceptor('files', 10, {
      fileFilter: (request, file, callback) => {
        if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
          // 이미지 형식은 jpg, jpeg, png만 허용
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
    }),
  )
  async runAnalysis(
    @UploadedFiles(GenerateFilenamePipe, extractExifPipe) files: Array<Express.Multer.File>,
    @Body('userId') userId: number,
  ) {
    const result = [];
    const { id: analysisId } = await this.analysisService.createAnalysis({
      userId,
      memo: undefined,
    });
    for (let file of files) {
      // 비동기

      const updatedFile = await Promise.all([
        this.appService.addHappinessRateField(file),
        this.appService.uploadImage(file),
      ]).then((values) => ({
        ...values[0],
        ...values[1],
      }));

      const image = await this.imageService.createImage({
        ...updatedFile,
        orgFilename: updatedFile.originalname,
        analysisId,
      });

      result.push(image);
      //동기
      // file = await this.appService.addHappinessRateField(file);
      //
      // const { filename, originalname, lat, lng, avgHappinessRate, url } =
      //   await this.appService.uploadImage(file);
      //
      // const image = await this.imageService.createImage({
      //   filename,
      //   orgFilename: originalname,
      //   lat,
      //   lng,
      //   avgHappinessRate,
      //   url,
      //   analysisId,
      // });
      // result.push(image);
    }

    return { data: result };
  }

  @Get('api/analysis')
  @Render('map')
  async getAnalysisById(@Query('analysisId', ParseIntPipe) id: number) {
    console.log(id);
    const data = await this.analysisService.getAnalysisById(id);
    return { data: data.imageList };
  }

  @Get('test')
  @Render('map')
  async testPage() {
    return {
      data: [
        {
          id: 4,
          filename: '8858288267385852-20190921_024320.JPEG',
          orgFilename: '20190921_024320.JPEG',
          lat: null,
          lng: null,
          url: 'https://happiestplace.blob.core.windows.net/uploads/8858288267385852-20190921_024320.JPEG?sv=2020-10-02&st=2022-03-18T03%3A17%3A23Z&se=2022-03-18T04%3A17%3A23Z&sr=b&sp=r&sig=w6nbJbDiMeut5LjRQVZQoYNWjE%2F3e%2BZuLt6pflancVo%3D',
          avgHappinessRate: 55.5,
          analysisId: 6,
          regDate: '2022-03-17T18:17:23.519Z',
        },
        {
          id: 5,
          filename: '13976412403539396-beauty_20190921182054.JPEG',
          orgFilename: 'beauty_20190921182054.JPEG',
          lat: '-26.14987',
          lng: '150.57434',
          url: 'https://happiestplace.blob.core.windows.net/uploads/13976412403539396-beauty_20190921182054.JPEG?sv=2020-10-02&st=2022-03-18T03%3A17%3A26Z&se=2022-03-18T04%3A17%3A26Z&sr=b&sp=r&sig=eWfzW2768%2BHkApTiQBx6PkPoz8HP9IZ%2FKXMdIpv5xMA%3D',
          avgHappinessRate: 48.6,
          analysisId: 6,
          regDate: '2022-03-17T18:17:26.751Z',
        },
        {
          id: 3,
          filename: '7029339202913483-beauty_20190921182213.JPEG',
          orgFilename: 'beauty_20190921182213.JPEG',
          lat: null,
          lng: null,
          url: 'https://happiestplace.blob.core.windows.net/uploads/7029339202913483-beauty_20190921182213.JPEG?sv=2020-10-02&st=2022-03-18T03%3A17%3A17Z&se=2022-03-18T04%3A17%3A17Z&sr=b&sp=r&sig=hyM8AztuUh2CFYKDdvwS6%2BdC%2FIv%2FKuN2ySnLmlVJDRw%3D',
          avgHappinessRate: 12.45,
          analysisId: 6,
          regDate: '2022-03-17T18:17:17.903Z',
        },
        {
          id: 3,
          filename: '7029339202913483-beauty_20190921182213.JPEG',
          orgFilename: 'beauty_20190921182213.JPEG',
          lat: null,
          lng: null,
          url: 'https://happiestplace.blob.core.windows.net/uploads/7029339202913483-beauty_20190921182213.JPEG?sv=2020-10-02&st=2022-03-18T03%3A17%3A17Z&se=2022-03-18T04%3A17%3A17Z&sr=b&sp=r&sig=hyM8AztuUh2CFYKDdvwS6%2BdC%2FIv%2FKuN2ySnLmlVJDRw%3D',
          avgHappinessRate: 12.45,
          analysisId: 6,
          regDate: '2022-03-17T18:17:17.903Z',
        },
        {
          id: 4,
          filename: '7029339202913483-beauty_20190921182213.JPEG',
          orgFilename: 'beauty_20190921182213.JPEG',
          lat: '34.63351',
          lng: '117.63439',
          url: 'https://happiestplace.blob.core.windows.net/uploads/7029339202913483-beauty_20190921182213.JPEG?sv=2020-10-02&st=2022-03-18T03%3A17%3A17Z&se=2022-03-18T04%3A17%3A17Z&sr=b&sp=r&sig=hyM8AztuUh2CFYKDdvwS6%2BdC%2FIv%2FKuN2ySnLmlVJDRw%3D',
          avgHappinessRate: 10.1,
          analysisId: 6,
          regDate: '2022-03-17T18:17:17.903Z',
        },
        {
          id: 5,
          filename: '7029339202913483-beauty_20190921182213.JPEG',
          orgFilename: 'beauty_20190921182213.JPEG',
          lat: '21.15589',
          lng: '79.12638',
          url: 'https://happiestplace.blob.core.windows.net/uploads/7029339202913483-beauty_20190921182213.JPEG?sv=2020-10-02&st=2022-03-18T03%3A17%3A17Z&se=2022-03-18T04%3A17%3A17Z&sr=b&sp=r&sig=hyM8AztuUh2CFYKDdvwS6%2BdC%2FIv%2FKuN2ySnLmlVJDRw%3D',
          avgHappinessRate: null,
          analysisId: 6,
          regDate: '2022-03-17T18:17:17.903Z',
        },
      ],
    };
  }
}
