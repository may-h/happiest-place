import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '../../config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      jwtFromRequest: (request) => {
        function parseAuthHeader(hdrValue) {
          if (typeof hdrValue !== 'string') {
            return null;
          }
          var matches = hdrValue.match(/(\S+)\s+(\S+)/);
          return matches && { scheme: matches[1], value: matches[2] };
        }

        var AUTH_HEADER = 'authorization';
        var token = null;

        // 1. header check
        if (request.headers[AUTH_HEADER]) {
          var auth_params = parseAuthHeader(request.headers[AUTH_HEADER]);
          if (auth_params && 'bearer' === auth_params.scheme.toLowerCase()) {
            token = auth_params.value;
          }
        }

        // 2. query check
        if (!token && request.query['token']) {
          token = request.query.token;
        }
        console.log(`final token - ${token}`);
        return token;
      },
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, nickname: payload.nickname };
  }
}
