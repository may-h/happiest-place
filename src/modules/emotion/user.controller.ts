import {Body, Controller, Delete, Get, Param, Post} from "@nestjs/common";
import {CreateUserDto} from "./dto/create-user.dto";
import {UserService} from "./user.service";

@Controller('auth')
export class UserController {

    constructor(private userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.findAll();
    }

    @Post('signup')
    signup(@Body() userData: CreateUserDto) {
        console.log(`id -> ${userData.nickname}`);
        return this.userService.signup(userData);
    }

    @Get(':id')
    findById(@Param('id') id: number) {
        return this.userService.findById(id);
    }

    @Delete(':id')
    deactivate(@Param('id') id: number) {
        return this.userService.deactivate(id); // 탈퇴
    }

}