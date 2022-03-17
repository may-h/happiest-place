import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Res,
} from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiTags } from '@nestjs/swagger';
import { CreateImageDto, UpdateImageDto } from './dtos';

@ApiTags('Images')
@Controller('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Post()
  async createImage(@Body() dto: CreateImageDto) {
    return await this.imageService.createImage(dto);
  }

  @Get()
  async getImages(@Query('analysisId') analysisId?: number) {
    return analysisId
      ? await this.imageService.getAllImageByAnalysisId(analysisId)
      : await this.imageService.getAllImages();
  }

  @Get(':id')
  async getImageById(@Param('id', ParseIntPipe) id: number | undefined) {
    const image = await this.imageService.getImageById(id);
    if (!image) {
      throw new NotFoundException();
    }
    return image;
  }

  @Put(':id')
  async updateImage(@Body() dto: UpdateImageDto, @Param('id', ParseIntPipe) id: number) {
    const image = await this.imageService.getImageById(id);
    if (!image) {
      throw new NotFoundException();
    }
    const updateResult = await this.imageService.updateImage(id, dto);
    if (updateResult.affected > 0) {
      return await this.imageService.getImageById(id);
    }
    throw new HttpException('something went wrong', 500);
  }

  @Delete(':id')
  async deleteImage(@Param('id', ParseIntPipe) id: number) {
    const image = await this.imageService.getImageById(id);
    if (!image) {
      throw new NotFoundException(`Not Found Image ID [${id}]`);
    }
    return await this.imageService.deleteImageById(id);
  }
}
