import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from '../user/user.service';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService) {}

  async validateUser(nickname, password) {
    const user = await this.userService.getUserByNickname(nickname);
    if (user && password === user.password) {
      const { password, ...rest } = user;
      return rest;
    }

    throw new UnauthorizedException('Invalid user or password');
  }
}
