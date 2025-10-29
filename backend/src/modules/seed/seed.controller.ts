import { Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { SeedService } from './seed.service';

@Controller('seed')
export class SeedController {
  constructor(private readonly seedService: SeedService) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  async executeSeed() {
    await this.seedService.seed();
    return {
      message: 'Database seeding completed successfully.',
    };
  }
}