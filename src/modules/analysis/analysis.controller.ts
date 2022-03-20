import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { AnalysisService } from './analysis.service';
import { CreateAnalysisDto } from './dtos/create-analysis.dto';
import { ApiTags } from '@nestjs/swagger';
import { UpdateAnalysisDto } from './dtos/update-analysis.dto';

@ApiTags('analysis')
@Controller('analysis')
export class AnalysisController {
  constructor(private readonly analysisService: AnalysisService) {}

  @Get()
  async getAnalyses(@Query('userId') userId?: number) {
    // TODO: User Check
    if (userId) {
      // const user = await this.userService.getUserById(userId);
      // if (!user) {
      //   throw new NotFoundException(`Not Found User ID [${userId}] `);
      // }
      return await this.analysisService.getAllAnalysesByUserId(userId);
    }

    return await this.analysisService.getAllAnalyses();
  }

  @Get(':id')
  async getAnalysisById(@Param('id', ParseIntPipe) id: number) {
    const analysis = await this.analysisService.getAnalysisById(id);
    if (!analysis) {
      throw new NotFoundException();
    }
    return analysis;
  }

  @Post()
  async createAnalysis(@Body() dto: CreateAnalysisDto) {
    return await this.analysisService.createAnalysis(dto);
  }

  @Put(':id')
  async updateAnalysis(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateAnalysisDto) {
    // TODO: User - Analysis Auth Check
    return await this.analysisService.updateAnalysis(id, dto);
  }

  @Delete(':id')
  async deleteAnalysis(@Param('id', ParseIntPipe) id: number) {
    const analysis = await this.analysisService.getAnalysisById(id);
    if (!analysis) {
      throw new NotFoundException(`Not Found Analysis ID [${id}]`);
    }
    return await this.analysisService.deleteAnalysis(id);
  }
}
