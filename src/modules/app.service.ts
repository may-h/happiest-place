import { Injectable } from '@nestjs/common';
import * as Face from '@azure/cognitiveservices-face';
import * as msRest from '@azure/ms-rest-js';
// import { User } from '../entity/User.entity';
// import { UserService } from './emotion/user.service';
// import { AnalysisService } from './analysis/analysis.service';
// import { EmotionService } from './emotion/emotion.service';
// import { ImageService } from './image/image.service';
// import { createImageDto } from './emotion/dto/create-image.dto';
// import { Analysis } from './analysis/entities/Analysis.entity';
import {
  BlobServiceClient,
  StorageSharedKeyCredential,
  BlobSASPermissions,
  generateBlobSASQueryParameters,
} from '@azure/storage-blob';
import { Readable } from 'stream';
import { ConfigService } from './config';
import { reduce } from 'rxjs';

@Injectable()
export class AppService {
  private FACE_API_CLIENT;
  private BLOB_SERVICE_CLIENT;
  private BLOB_CONTAINER_CLIENT;
  private readonly sharedKeyCredential;

  constructor(private readonly configService: ConfigService) {
    this.FACE_API_CLIENT = new Face.FaceClient(
      new msRest.ApiKeyCredentials({
        inHeader: { 'Ocp-Apim-Subscription-Key': this.configService.get('FACE_KEY') },
      }),
      this.configService.get('FACE_END_POINT'),
    );
    this.sharedKeyCredential = new StorageSharedKeyCredential(
      this.configService.get('AZURE_STORAGE_ACCOUNT_NAME'),
      this.configService.get('AZURE_STORAGE_KEY'),
    );
    this.BLOB_SERVICE_CLIENT = new BlobServiceClient(
      `https://${this.configService.get('AZURE_STORAGE_ACCOUNT_NAME')}.blob.core.windows.net`,
      this.sharedKeyCredential,
    );
    this.BLOB_CONTAINER_CLIENT = this.BLOB_SERVICE_CLIENT.getContainerClient(
      this.configService.get('AZURE_STORAGE_CONTAINER'),
    );
  }

  async analyzeEmotion(buffer: Buffer) {
    return await this.FACE_API_CLIENT.face.detectWithStream(buffer, {
      returnFaceAttributes: ['Emotion'],
      detectionModel: 'detection_01',
    });
  }

  private getSumHappiness(detectedEmotion) {
    return detectedEmotion.length
      ? detectedEmotion.reduce((sum, face) => {
          return sum + face.faceAttributes.emotion.happiness;
        }, 0)
      : undefined;
  }

  private parseToPercentage(score) {
    return (score * 100).toFixed(2);
  }

  async addHappinessRateField(file) {
    console.time('emotion');
    const detectedEmotion = await this.analyzeEmotion(file.buffer);
    const sumHappiness = this.getSumHappiness(detectedEmotion);
    console.timeEnd('emotion');

    file.avgHappinessRate =
      sumHappiness && !isNaN(sumHappiness)
        ? this.parseToPercentage(sumHappiness % detectedEmotion.length)
        : undefined;

    return file;
  }

  async getUrl(blobName: string) {
    const sasOptions = {
      containerName: this.configService.get('AZURE_STORAGE_CONTAINER'),
      blobName,
      startsOn: new Date(),
      expiresOn: new Date(new Date().valueOf() + 3600 * 1000),
      permissions: BlobSASPermissions.parse('r'),
    };

    // const sasToken = generateBlobSASQueryParameters(
    //   sasOptions,
    //   this.sharedKeyCredential,
    // ).toString();
    // console.log(`SAS token for blob is: ${sasToken}`);

    // return `${this.BLOB_CONTAINER_CLIENT.getBlockBlobClient(blobName).url}?${sasToken}`;
    return `${this.BLOB_CONTAINER_CLIENT.getBlockBlobClient(blobName).url}`;
  }

  async uploadImage(file) {
    console.time('upload');
    const { filename } = file;
    const uploadOptions = { bufferSize: 4 * 1024 * 1024, maxBuffers: 20 };

    const stream = Readable.from(file.buffer);
    const blockBlobClient = this.BLOB_CONTAINER_CLIENT.getBlockBlobClient(filename);
    try {
      await blockBlobClient.uploadStream(
        stream,
        uploadOptions.bufferSize,
        uploadOptions.maxBuffers,
        {
          blobHTTPHeaders: { blobContentType: 'image/jpeg' },
        },
      );
      console.timeEnd('upload');
      console.log(`File uploaded to Azure Blob Storage. - ${filename}`);

      console.time('url');
      file.url = await this.getUrl(filename);

      console.timeEnd('url');
      return file;
    } catch (err) {
      console.error(err);
      throw new Error(err);
    }
  }

  /**
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
   */
}
