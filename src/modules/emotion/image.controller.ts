import { Controller, Get, Param } from '@nestjs/common';
import { ImageService } from './image.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('image')
@ApiTags('image')
export class ImageController {
  constructor(private imageService: ImageService) {}

  @Get()
  findAll() {
    return this.imageService.findAll();
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    return this.imageService.findById(id);
  }
}
