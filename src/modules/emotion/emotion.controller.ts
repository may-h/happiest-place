import { Body, Controller, Post, Render, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { EmotionService } from './emotion.service';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { CreateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('emotion')
@ApiTags('emotion')
export class EmotionController {
  constructor(private readonly emotionService: EmotionService) {}

  orderData(data) {
    return data.sort((a, b) => b.happiness - a.happiness);
  }

  @Post()
  // @Render('map')
  @UseInterceptors(FilesInterceptor('files'))
  async emotion(
    @UploadedFiles() files: Array<Express.Multer.File>,
    @Body('user_id') userId: number,
  ) {
    // const res = await this.emotionService.run(files, userId);
    // return {
    //     data: this.orderData(res)
    // }
  }

  @Post('/test')
  @Render('map')
  test() {
    return {
      data: [
        {
          gps: {
            lat: 37.6,
            lng: 127.14111111111112,
          },
          url: 'https://picsum.photos/200/300',
          happiness: 0.27749999999999997,
        },
        {
          gps: {
            lat: 36.40417,
            lng: 139.7426,
          },
          url: 'https://picsum.photos/200/300',
          happiness: 0.544,
        },
        {
          gps: {
            lat: 39.39552,
            lng: 248.36967,
          },
          url: 'https://picsum.photos/200/300',
          happiness: 1,
        },
        {
          gps: {},
          url: 'https://picsum.photos/200/300',
          happiness: 0.81,
        },
        {
          gps: {},
          url: 'https://picsum.photos/200/300',
          happiness: 0.81,
        },
      ],
    };
  }
}
