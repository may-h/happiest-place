import {EntityRepository, Repository} from "typeorm";
import {AnalysisGroup} from "../../entity/AnalysisGroup.entity";

@EntityRepository(AnalysisGroup)
export class AnalysisGroupRepository extends Repository<AnalysisGroup>{

    async getAll() {
        return this.find();
    }

    async createAnalysis(data) {
        const analyGrp = this.create(data);
        await this.save(analyGrp);
        return analyGrp;
    }

    async getByUser(userId: number) {
        return await this.find({owner: userId})
    }

    async getById(id: number) {
        return this.findOne({id});
    }
}