import {
    Body,
    Controller,
    Get,
    NotFoundException,
    Param,
    Post, Render, UploadedFile,
    UploadedFiles,
    UseInterceptors
} from "@nestjs/common";
import {EmotionService} from "./emotion.service";
import {FileInterceptor, FilesInterceptor} from "@nestjs/platform-express";

@Controller('emotion')
export class EmotionController {
    constructor(private readonly emotionService: EmotionService) {}

    orderData(data) {
        return data.sort((a, b) => b.happiness - a.happiness);
    }

    @Post()
    @Render('map')
    @UseInterceptors(FilesInterceptor('files'))
    async emotion(@UploadedFiles() files: Array<Express.Multer.File>, @Body('user_id') userId: number) {
        const res = await this.emotionService.run(files, userId);
        return {
            data: this.orderData(res)
        }
    }


}