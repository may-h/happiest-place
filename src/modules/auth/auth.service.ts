import { Injectable, Logger, NotAcceptableException } from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../user/dtos/create-user.dto';
import { ConfigService } from '../config';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async validateUser(nickname: string, password: string): Promise<any> {
    const user = await this.userService.getUserByNickname(nickname);
    const isMatch = await bcrypt.compare(password, user.password);

    if (user && isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  async signup(user: CreateUserDto) {
    const { nickname, password } = user;
    const BCRYPT_SALT_ROUNDS = Number(this.configService.get('SALT_ROUNDS'));

    const existUser = await this.userService.getUserByNickname(nickname);
    if (existUser) {
      this.logger.debug(`Fail to signup for user nickname [${user.nickname}]`);
      throw new NotAcceptableException('User with provided nickname already exist');
    }
    const hashedPassword = await bcrypt.hash(password, BCRYPT_SALT_ROUNDS);

    return await this.userService.createUser({
      nickname,
      password: hashedPassword,
    });
  }

  async login(user: any) {
    const payload = { nickname: user.nickname, userId: user.id };
    return {
      id: user.id,
      access_token: this.jwtService.sign(payload),
    };
  }
}
