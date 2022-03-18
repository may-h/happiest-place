import { Module } from '@nestjs/common';
import { AnalysisController } from './analysis.controller';
import { AnalysisService } from './analysis.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Analysis } from './entities/Analysis.entity';
import { Image } from '../image/entities/Image.entity';
import { UserModule } from '../user/user.module';
import { ImageService } from '../image/image.service';
import { ImageController } from '../image/image.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Analysis])],
  providers: [AnalysisService],
  controllers: [AnalysisController],
  exports: [AnalysisService],
})
export class AnalysisModule {}
