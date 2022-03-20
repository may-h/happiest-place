import { Injectable, NotFoundException } from '@nestjs/common';
import { createQueryBuilder, Repository } from 'typeorm';
import { Analysis } from './entities/Analysis.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateAnalysisDto } from './dtos/create-analysis.dto';
import { UpdateAnalysisDto } from './dtos/update-analysis.dto';

@Injectable()
export class AnalysisService {
  constructor(
    @InjectRepository(Analysis)
    private analysisRepository: Repository<Analysis>,
  ) {}

  async getAllAnalyses() {
    return this.analysisRepository.find({ order: { regDate: 'DESC' } });
  }

  async getAllAnalysesByUserId(userId: number) {
    // return this.analysisRepository.find({ where: { userId: id } });
    return await this.analysisRepository
      .createQueryBuilder('analysis')
      .leftJoinAndSelect('analysis.imageList', 'image')
      .where('analysis.userId = :userId', { userId })
      .orderBy('image.avgHappinessRate', 'DESC', 'NULLS LAST')
      .getMany();
  }

  async getAnalysisById(id: number) {
    return await this.analysisRepository
      .createQueryBuilder('analysis')
      .leftJoinAndSelect('analysis.imageList', 'image')
      .where('analysis.id = :id', { id })
      .orderBy('image.avgHappinessRate', 'DESC', 'NULLS LAST')
      .getOne();
  }

  async createAnalysis(dto: CreateAnalysisDto) {
    // TODO: User Id Check
    console.log(dto);
    const analysis = this.analysisRepository.create(dto);
    console.log(analysis);
    return await this.analysisRepository.save(analysis);
  }

  async updateAnalysis(id: number, dto: UpdateAnalysisDto) {
    return await this.analysisRepository.update(id, dto);
  }

  async deleteAnalysis(id) {
    return await this.analysisRepository.delete(id);
  }
}
