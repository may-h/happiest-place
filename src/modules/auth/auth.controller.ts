import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  ParseIntPipe,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { LoginDto } from './dtos/login.dto';
import { log } from 'util';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly userService: UserService,
  ) {}

  @Post('signup')
  async signup(@Body() dto: CreateUserDto) {
    console.log(dto);
    const user = await this.userService.createUser(dto);
    if (user) {
      // TODO - auth token
      // const token = await this.authService.createToken(user);
    }
    return user;
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    const { nickname, password } = loginDto;
    // TODO: return with createdJWTToken
    return await this.authService.validateUser(nickname, password);
  }

  @Delete(':id')
  async withdrawal(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.getUserById(id);
    if (!user) {
      throw new NotFoundException(`Not Found User ID [${id}]`);
    }
    return await this.userService.deleteUser(id);
  }

  // TODO: create me route

  // TODO: deactive auth
}
