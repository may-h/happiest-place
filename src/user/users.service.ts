import {Injectable} from "@nestjs/common";
import {Repository} from "typeorm";
import {User} from "../entity/User.entity";
import {InjectRepository} from "@nestjs/typeorm";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    async create(nickname) {
        this.userRepository.create({nickname});
        return await this.userRepository.save({nickname})
    }
}