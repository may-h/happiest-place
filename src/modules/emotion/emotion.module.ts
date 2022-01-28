import {Module} from "@nestjs/common";
import {EmotionController} from "./emotion.controller";
import {EmotionService} from "./emotion.service";
// import {AnalysisGroupRepository} from "./analysisGroup.repository";
// import {TypeOrmModule} from "@nestjs/typeorm";
import {AnalysisController} from "./analysis.controller";
import {AnalysisService} from "./analysis.service";


@Module({
    imports: [
        // TypeOrmModule.forFeature([AnalysisGroupRepository])
    ],
    providers: [EmotionService/*, AnalysisService*/],
    controllers: [EmotionController/*, AnalysisController*/]
})
export class EmotionModule {}