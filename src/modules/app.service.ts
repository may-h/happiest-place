import { Injectable } from '@nestjs/common';
import { User } from '../entity/User.entity';
import { UserService } from './emotion/user.service';
import { AnalysisService } from './analysis/analysis.service';
import { EmotionService } from './emotion/emotion.service';
import { ImageService } from './image/image.service';
import { createImageDto } from './emotion/dto/create-image.dto';
import { Analysis } from '../entity/Analysis.entity';

@Injectable()
export class AppService {
  constructor(
    private userService: UserService,
    private analysisService: AnalysisService,
    private imageService: ImageService,
    private emotionService: EmotionService,
  ) {}
  getHello(): string {
    return 'Hello World!';
  }

  async run(files: Array<Express.Multer.File>, userId: number) {
    const user = await this.userService.findById(userId);
    console.log(user);
    if (user) {
      console.log(user);

      let result = [];
      let analysis = await this.analysisService.create(userId);
      for await (const file of files) {
        console.log(file);
        const uploadFilename = this.emotionService.generateBlobName(file.originalname);
        const res = await Promise.all([
          this.emotionService.getGps(file),
          this.emotionService.uploadBlob(file, uploadFilename),
          this.emotionService.getAvgHappinessRate(await this.emotionService.getEmotion(file)),
        ]).then((values) => ({ gps: values[0], url: values[1], happiness: values[2] }));

        const imageData: createImageDto = {
          filename: uploadFilename,
          orgFilename: file.originalname,
          lat: res.gps.lat,
          lng: res.gps.lng,
          url: res.url,
          avgHappinessRate: res.happiness,
          analysis,
        };

        // const image = await this.imageService.create(imageData);
        // result.push(image);
      }

      return result;
    } else {
      return 'user not found';
    }
  }
}
