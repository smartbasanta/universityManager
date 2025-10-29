import { Strategy, ExtractJwt, StrategyOptionsWithRequest } from 'passport-jwt';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import * as dotenv from 'dotenv';

dotenv.config();

@Injectable()
export class AtStrategy extends PassportStrategy(Strategy, 'jwt-access') {
  constructor() {
    const secretOrKey = process.env.AT_SECRET;

    // Ensure the secret is defined
    if (!secretOrKey) {
      throw new ForbiddenException(
        'JWT_ACCESS_SECRET is not defined in environment variables.',
      );
    }

    const options: StrategyOptionsWithRequest = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey,
      ignoreExpiration: false,
      passReqToCallback: true,
    };

    super(options);
  }

  async validate(req: any, payload: any) {
    return payload;
  }
}
