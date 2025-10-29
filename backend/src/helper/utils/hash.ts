import { Injectable, UnauthorizedException } from '@nestjs/common';
import * as argon from 'argon2';

@Injectable()
export class hash {
  async value(value: string) {
    try {
      return await argon.hash(value);
    } catch (error) {
      throw error;
    }
  }

  async verifyHashing(originalData: string, newData: string): Promise<boolean> {
    if (!originalData) {
      throw new UnauthorizedException('Invalid password');
    }
    return await argon.verify(originalData, newData);
  }
}
