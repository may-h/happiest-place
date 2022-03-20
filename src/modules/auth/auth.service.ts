import { Injectable } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dtos/login.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UserService, private jwtService: JwtService) {}

  async validateUser(nickname: string, password: string): Promise<any> {
    const user = await this.userService.getUserByNickname(nickname);
    if (user && user.password == password) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async login(user: any) {
    const payload = { nickname: user.nickname, userId: user.id };
    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }
}
