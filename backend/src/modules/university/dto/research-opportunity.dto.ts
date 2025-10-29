import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl, IsBoolean } from 'class-validator';

export class UniversityResearchOpportunityDto {
  @ApiProperty({ example: 'AI in Healthcare Research', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({
    example:
      'Research project focusing on AI applications in healthcare diagnostics',
    required: false,
  })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({
    example: 'https://university.edu/research/project123',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  url?: string;

  @ApiProperty({ example: false, required: false })
  @IsOptional()
  @IsBoolean()
  isDraft?: boolean;
}
