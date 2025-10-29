import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JwtPayload } from 'src/helper/types/index.type'; // Ensure this is correctly defined in your types file

@Injectable()
export class RtStrategy extends PassportStrategy(Strategy, 'jwt-refresh') {
  constructor(
    private readonly configService: ConfigService,
    // private readonly authService: AuthService,  // Uncomment this if you need it for refresh token validation
  ) {
    const secretOrKey = configService.get<string>('RT_SECRET');

    if (!secretOrKey) {
      throw new Error('JWT RT_SECRET is not defined in environment variables.');
    }

    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: secretOrKey,
      ignoreExpiration: false,
      passReqToCallback: true,
    });
  }

  async validate(req: Request, payload: JwtPayload) {
    const refreshToken = req.get('Authorization')?.replace('Bearer ', '');

    if (!refreshToken) {
      throw new ForbiddenException('Refresh token malformed');
    }

    // Uncomment and use authService to validate the refresh token, if needed
    // const user = await this.authService.validateRToken(refreshToken, payload.sub, payload.role);
    // if (!user) throw new ForbiddenException('Refresh token invalid or expired');

    return {
      ...payload,
      refreshToken,
    };
  }
}
