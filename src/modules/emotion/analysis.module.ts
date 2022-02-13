import {Module} from "@nestjs/common";
import {AnalysisController} from "./analysis.controller";
import {AnalysisService} from "./analysis.service";
import {TypeOrmModule} from "@nestjs/typeorm";
import {Analysis} from "../../entity/Analysis.entity";
import {Image} from "../../entity/Image.entity";
import {UserModule} from "./user.module";
import {ImageService} from "./image.service";
import {ImageController} from "./image.controller";

@Module({
    imports: [TypeOrmModule.forFeature([Analysis, Image]), UserModule],
    providers: [AnalysisService, ImageService],
    controllers: [AnalysisController, ImageController],
    exports: [AnalysisService, ImageService]
})
export class AnalysisModule {

}