import {Injectable, NotFoundException} from "@nestjs/common";
import {Repository} from "typeorm";
import {Analysis} from "../../entity/Analysis.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../../entity/User.entity";
import {UserService} from "./user.service";


@Injectable()
export class AnalysisService {

    constructor(
        @InjectRepository(Analysis)
        private analysisRepo: Repository<Analysis>,
        private userService: UserService
    ) {}

    findAll() {
        return this.analysisRepo.find();
    }

    async create(createAnalysisDto) {
        const {userId} = createAnalysisDto;
        const user = await this.userService.findById(userId);
        console.log(user)
        if(user) {
            const analysis = new Analysis();
            analysis.user = user;
            return await this.analysisRepo.save(analysis);
        } else {
            throw new NotFoundException('user not found')
        }
    }

    async findById(id: number) {
        const analysis = await this.analysisRepo.findOne({id}, {relations: ['imageList', 'user'] });
        if(analysis) {
            return analysis;
        } else {
            throw new NotFoundException('analysis not found');
        }
    }
}