import {Body, Controller, Get, Param, Post} from "@nestjs/common";
import {AnalysisService} from "./analysis.service";
import {CreateAnalysisDto} from "./dto/create-analysis.dto";

@Controller('analysis')
export class AnalysisController {

    constructor(private readonly analysisService: AnalysisService) {}

    @Get()
    findAll() {
        return this.analysisService.findAll();
    }

    @Get(':id')
    findById(@Param('id') id: number) {
        return this.analysisService.findById(id);
    }


    @Post()
    create(@Body() createAnalysisDto: CreateAnalysisDto) {
        return this.analysisService.create(createAnalysisDto);
    }

}