import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class UtStrategy extends PassportStrategy(Strategy, 'jwt-reset') {
  constructor(config: ConfigService) {
    const secretOrKey = config.get<string>('UTIL_SECRET');
    if (!secretOrKey) {
      throw new BadGatewayException(
        'UTIL_SECRET not inserted in environment variables',
      );
    }
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretOrKey,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }
  async validate(req: Request, payload) {
    console.log(payload);

    return payload;
  }
}
