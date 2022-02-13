import {Injectable} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {User} from "../../entity/User.entity";
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";

@Injectable()
export class UserService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User> // DB와의 연결 정의
    ) {}

    async findAll() {
        return this.userRepository.find();
    }

    async signup(userData: CreateUserDto) {
        const user = new User()
        user.nickname = userData.nickname;

        const newUser = this.userRepository.create(user);
        await this.userRepository.save(newUser);
        return newUser;
    }

    async deactivate(id: number) {
        const user = await this.userRepository.findOne({id});
        if(user) {
            console.log(user);
            await this.userRepository.remove(user);
            return `success`
        }

        return 'fail';
    }

    async findById(id: number) {
        return await this.userRepository.findOne(id);
    }
}