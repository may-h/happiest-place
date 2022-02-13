import {Module} from "@nestjs/common";
import {EmotionController} from "./emotion.controller";
import {EmotionService} from "./emotion.service";
import {AnalysisController} from "./analysis.controller";
import {AnalysisService} from "./analysis.service";
import {UserService} from "./user.service";
import {TypeOrmModule} from "@nestjs/typeorm";


@Module({
    imports: [
    ],
    providers: [EmotionService/*, AnalysisService*/],
    controllers: [EmotionController/*, AnalysisController*/],
    exports: [EmotionService]
})
export class EmotionModule {}