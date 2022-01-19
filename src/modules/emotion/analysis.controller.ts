import {Body, Controller, Get, NotFoundException, Param, Post} from "@nestjs/common";
import {AnalysisService} from "./analysis.service";

@Controller('analysis')
export class AnalysisController {

    constructor(private analysisService: AnalysisService) {}

    @Get('analysis/:id')
    async getAnalysisById(@Param('id') anal_id: number) {
        const result = await this.analysisService.getAnalysisById(anal_id);
        if(!result) throw new NotFoundException();

        return result;
    }

    @Get('analysis/user/:userId')
    getAnalysisByUser(@Param('userId') userId: number) {
        return this.analysisService.getAnalysisByUser(userId);
    }

    @Get('analysis')
    getAll() {
        return this.analysisService.getAllAnalysis();
    }

    @Post('analysis')
    createAnalysis(@Body() data) {
        return this.analysisService.createAnalysis(data);
    }

}