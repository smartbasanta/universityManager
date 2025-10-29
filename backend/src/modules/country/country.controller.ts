import { Controller, Get, Param, UseInterceptors } from '@nestjs/common';
import { CountryService } from './country.service';
import { ApiTags } from '@nestjs/swagger';
import { CacheInterceptor } from '@nestjs/cache-manager';

@Controller('country')
@UseInterceptors(CacheInterceptor)
@ApiTags('country')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}
  @Get()
  findAll() {
    return this.countryService.findAll();
  }

  @Get(':code')
  findOne(@Param('code') code: string) {
    return this.countryService.findOneByCode(code.toUpperCase());
  }
}
