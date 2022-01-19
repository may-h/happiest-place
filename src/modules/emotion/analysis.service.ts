import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {AnalysisGroupRepository} from "./analysisGroup.repository";

@Injectable()
export class AnalysisService {
    constructor(
        @InjectRepository(AnalysisGroupRepository)
        private analysisGroupRepository: AnalysisGroupRepository
    ) {}


    getAnalysisById(analysisId: number) {
        return this.analysisGroupRepository.getById(analysisId);
    }

    getAnalysisByUser(userId: number) {
        return this.analysisGroupRepository.getByUser(userId);
    }

    getAllAnalysis() {
        return this.analysisGroupRepository.getAll();
    }

    createAnalysis(data) {
        return this.analysisGroupRepository.createAnalysis(data);
    }
}