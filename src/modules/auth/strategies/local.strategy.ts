import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'nickname' });
  }

  async validate(nickname: string, password: string): Promise<any> {
    const user = await this.authService.validateUser(nickname, password);
    if (!user) {
      throw new UnauthorizedException('User password or nickname provided not matched');
    }

    return user;
  }
}
