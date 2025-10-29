import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class FilterUniversityWebsiteDto {

  @ApiProperty({ example: 'Harvard', description: 'Search by university name', required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ example: 'nepal', description: 'Country', required: false })
  @IsOptional()
  @IsString()
  country?: string;

  @ApiProperty({ example: 'Urban', description: 'Area type', required: false })
  @IsOptional()
  @IsString()
  area_type?: string;

  @ApiProperty({ example: 'type', description: 'University type', required: false })
  @IsOptional()
  @IsString()
  type?: string;
}
