import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';
import {
  accountApprovalPayload,
  JwtPayload,
  roleType,
  VerifyPayload,
} from '../types/index.type';
import { ConfigService } from '@nestjs/config';
require('dotenv').config();

@Injectable()
export class Token {
  constructor(
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async generateRefreshToken(jwtPayload: JwtPayload) {
    const expirationTimeInSeconds = '30d';
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.RT_SECRET,
      expiresIn: expirationTimeInSeconds,
    });
    return token;
  }
  async generateAcessToken(jwtPayload: JwtPayload) {
    const expirationTimeInSeconds = '1d';
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.AT_SECRET,
      expiresIn: expirationTimeInSeconds,
    });
    return token;
  }
  async generateUtilToken(jwtPayload: JwtPayload) {
    const expirationTimeInSeconds = '10m';
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('UTIL_SECRET'),
      expiresIn: expirationTimeInSeconds,
    });
    return token;
  }

  async generateVerifyToken(jwtPayload: VerifyPayload) {
    const expirationTimeInSeconds = '10m';
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: this.config.get<string>('JWT_VERIFY_SECRET'), 
      // secret: process.env.UTIL_SECRET,
      expiresIn: expirationTimeInSeconds,
    });
    return token;
  }

  async generateAccountApprovalToken(jwtPayload: accountApprovalPayload) {
    const expirationTime = '10d';
    const token = await this.jwtService.signAsync(jwtPayload, {
      secret: process.env.UTIL_SECRET,
      expiresIn: expirationTime,
    });
    return token;
  }

  /**
   * *** THIS IS THE NEW METHOD ***
   * Verifies a token using a specific secret.
   * This is needed for manual verification outside of a Guard (e.g., email verification).
   */
  async verify<T>(token: string, secret?: string): Promise<T> {
    try {
      // The `verifyAsync` method returns a generic object.
      // We use `as T` to assert that its shape matches the generic type `T`
      // provided by the caller (e.g., VerifyPayload).
      const payload = await this.jwtService.verifyAsync(token, { secret });
      return payload as T;
    } catch (e) {
      // Re-throw the error to be handled by the calling service
      throw e;
    }
  }
}
