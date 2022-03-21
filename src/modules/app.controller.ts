import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  ParseIntPipe,
  Post,
  Query,
  Redirect,
  Render,
  Req,
  Res,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageService } from './image/image.service';
import { AnalysisService } from './analysis/analysis.service';
import { GenerateFilenamePipe } from './pipes/generate-filename.pipe';
import { extractExifPipe } from './pipes/extract-exif.pipe';
import { AppService } from './app.service';
import { AuthService } from './auth/auth.service';
import { LoginDto } from './auth/dtos/login.dto';
import { JwtAuthGuard } from './auth/jwt-auth.guard';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly imageService: ImageService,
    private readonly analysisService: AnalysisService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  @Render('index')
  root() {
    return { title: 'Happiest Place 🧳' };
  }

  // @UseGuards(JwtAuthGuard)
  @Get('home')
  @Render('home')
  home(@Req() req, @Query('token') token: string) {
    return { token, ...req.user };
  }

  @Post('api/analyzeEmotion')
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
    @Body('memo') memo: string,
    @Res() res,
  ) {
    const { id: analysisId } = await this.analysisService.createAnalysis({
      userId,
      memo,
    });

    for (let file of files) {
      const updatedFile = await Promise.all([
        this.appService.addHappinessRateField(file),
        this.appService.uploadImage(file),
      ]).then((values) => ({
        ...values[0],
        ...values[1],
      }));

      await this.imageService.createImage({
        ...updatedFile,
        orgFilename: updatedFile.originalname,
        analysisId,
      });

      console.log(`analysisId : ${analysisId}`);
      res.redirect(`/detail?analysisId=${analysisId}`);
    }
  }

  @Get('list')
  @Render('list')
  async listPage(@Query('userId', ParseIntPipe) userId: number) {
    const data = await this.analysisService.getAllAnalysesByUserId(userId);
    return { data };
  }

  @Get('detail')
  @Render('map')
  async goDetail(@Query('analysisId', ParseIntPipe) id: number) {
    const data = await this.analysisService.getAnalysisById(id);
    return { data: data.imageList };
  }

  @Get('demo')
  @Render('map')
  async testPage() {
    return {
      data: [
        {
          id: 10,
          filename: '6016197057766142-2018-08-30-19-59-17-431.jpg',
          orgFilename: '2018-08-30-19-59-17-431.jpg',
          lat: '33.45883888888889',
          lng: '126.83023055555554',
          url: 'https://happiestplace.blob.core.windows.net/uploads/6016197057766142-2018-08-30-19-59-17-431.jpg',
          avgHappinessRate: 99.9,
          analysisId: 1,
          regDate: '2022-03-17T23:57:49.773Z',
        },
        {
          id: 6,
          filename: '3107830277883157-P20170624_121130000_AEA6F6D1-46DC-4735-8192-F0CB007968AA.JPG',
          orgFilename: 'P20170624_121130000_AEA6F6D1-46DC-4735-8192-F0CB007968AA.JPG',
          lat: '36.60776',
          lng: '-82.11119',
          url: 'https://happiestplace.blob.core.windows.net/uploads/33619204608504805-P20161031_112510000_4530EC89-9BBB-4D5D-B5A5-3EAD20D1ED64.JPG',
          avgHappinessRate: 98.2,
          analysisId: 1,
          regDate: '2022-03-17T23:56:35.994Z',
        },
        {
          id: 12,
          filename: '7594003993648453-1539434659190.jpg',
          orgFilename: '1539434659190.jpg',
          lat: null,
          lng: null,
          url: 'https://happiestplace.blob.core.windows.net/uploads/4682805447866114-2018-12-30-20-00-03-753.jpg',
          avgHappinessRate: 80.44,
          analysisId: 1,
          regDate: '2022-03-17T23:58:03.317Z',
        },
        {
          id: 3,
          filename:
            '07326787146206937-P20170216_103603000_5BFBB3A8-65CA-4EA7-B917-74EE7DBAFECF.JPG',
          orgFilename: 'P20170216_103603000_5BFBB3A8-65CA-4EA7-B917-74EE7DBAFECF.JPG',
          lat: '-6.86997',
          lng: '-75.04585',
          url: 'https://happiestplace.blob.core.windows.net/uploads/07326787146206937-P20170216_103603000_5BFBB3A8-65CA-4EA7-B917-74EE7DBAFECF.JPG',
          avgHappinessRate: 68.75,
          analysisId: 1,
          regDate: '2022-03-17T23:55:30.728Z',
        },
        {
          id: 1,
          filename:
            '33619204608504805-P20161031_112510000_4530EC89-9BBB-4D5D-B5A5-3EAD20D1ED64.JPG',
          orgFilename: 'P20161031_112510000_4530EC89-9BBB-4D5D-B5A5-3EAD20D1ED64.JPG',
          lat: '28.54211',
          lng: '-81.37903',
          url: 'https://happiestplace.blob.core.windows.net/uploads/29347292920666246-P20171224_224753000_F9E0B2AF-B9C3-4C66-9086-83ED6689ADEE.JPG',
          avgHappinessRate: 56.9,
          analysisId: 1,
          regDate: '2022-03-17T23:55:26.742Z',
        },
        {
          id: 8,
          filename:
            '29347292920666246-P20171224_224753000_F9E0B2AF-B9C3-4C66-9086-83ED6689ADEE.JPG',
          orgFilename: 'P20171224_224753000_F9E0B2AF-B9C3-4C66-9086-83ED6689ADEE.JPG',
          lat: '51.50732',
          lng: '-0.12765',
          url: 'https://happiestplace.blob.core.windows.net/uploads/3107830277883157-P20170624_121130000_AEA6F6D1-46DC-4735-8192-F0CB007968AA.JPG',
          avgHappinessRate: 53.11,
          analysisId: 1,
          regDate: '2022-03-17T23:57:45.554Z',
        },
        {
          id: 13,
          filename:
            '21561099691697216-P20170202_113846000_E413E34F-5F3E-4E56-94C7-36DDE0F57601.JPG',
          orgFilename: 'P20170202_113846000_E413E34F-5F3E-4E56-94C7-36DDE0F57601.JPG',
          lat: null,
          lng: null,
          url: 'https://happiestplace.blob.core.windows.net/uploads/19279100414858097-P20180102_145134000_86E593BA-F348-4076-ACAB-97A5948684CF.JPG',
          avgHappinessRate: 31.1,
          analysisId: 1,
          regDate: '2022-03-17T23:55:28.683Z',
        },
        {
          id: 12,
          filename:
            '21561099691697216-P20170202_113846000_E413E34F-5F3E-4E56-94C7-36DDE0F57601.JPG',
          orgFilename: 'P20170202_113846000_E413E34F-5F3E-4E56-94C7-36DDE0F57601.JPG',
          lat: null,
          lng: null,
          url: 'https://happiestplace.blob.core.windows.net/uploads/BandPhoto_2018_08_31_18_40_58.jpg',
          avgHappinessRate: 79.34,
          analysisId: 1,
          regDate: '2022-03-17T23:55:28.683Z',
        },
        {
          id: 11,
          filename:
            '21561099691697216-P20170202_113846000_E413E34F-5F3E-4E56-94C7-36DDE0F57601.JPG',
          orgFilename: 'P20170202_113846000_E413E34F-5F3E-4E56-94C7-36DDE0F57601.JPG',
          lat: null,
          lng: null,
          url: 'https://happiestplace.blob.core.windows.net/uploads/P20170315_190555000_445B4146-B597-4935-99A6-8667078AC146.JPG',
          avgHappinessRate: null,
          analysisId: 44.56,
          regDate: '2022-03-17T23:55:28.683Z',
        },
      ],
    };
  }
}
