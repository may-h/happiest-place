import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../entity/User.entity";
import {Module} from "@nestjs/common";
import {UsersService} from "./users.service";
import {UsersController} from "./users.controller";


@Module({
    imports: [TypeOrmModule.forFeature([User])],
    providers: [UsersService],
    controllers: [UsersController],
    exports: [TypeOrmModule]
})
export class UsersModule {}