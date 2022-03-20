import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Image } from './entities/Image.entity';
import { Repository } from 'typeorm';
import { CreateImageDto, UpdateImageDto } from './dtos';

@Injectable()
export class ImageService {
  constructor(
    @InjectRepository(Image)
    private readonly imageRepository: Repository<Image>,
  ) {}

  async createImage(dto: CreateImageDto) {
    const image = this.imageRepository.create(dto);
    return await this.imageRepository.save(image);
  }

  async getAllImages() {
    return await this.imageRepository.find({
      order: { avgHappinessRate: 'DESC' },
    });
  }

  async getAllImageByAnalysisId(analysisId: number) {
    return await this.imageRepository.find({ where: { analysisId } });
  }

  async getImageById(id: number) {
    return await this.imageRepository.findOne({ id });
  }

  async deleteImageById(id: number) {
    return await this.imageRepository.delete(id);
  }

  async updateImage(id: number, updatedData: UpdateImageDto) {
    return await this.imageRepository.update(id, updatedData);
  }
}
