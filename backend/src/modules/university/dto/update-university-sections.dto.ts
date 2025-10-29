import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, ValidateNested } from 'class-validator';

// --- Career Outcomes DTOs ---
class CreateTopEmployerDto {
  @ApiProperty() @IsString() company_name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() industry?: string;
  @ApiPropertyOptional() @IsOptional() @IsUrl() company_website?: string;
}

export class UpdateCareerOutcomesDto {
  @ApiPropertyOptional() @IsOptional() @IsNumber() employment_rate_6_months?: number;
  @ApiPropertyOptional() @IsOptional() @IsNumber() median_starting_salary?: number;
  @ApiPropertyOptional() @IsOptional() @IsUrl() report_source_url?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() report_year?: number;
  @ApiPropertyOptional({ type: [CreateTopEmployerDto] })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateTopEmployerDto)
  top_employers?: CreateTopEmployerDto[];
}

// --- Notable Alumni DTO ---
export class CreateNotableAlumniDto {
  @ApiProperty() @IsString() name: string;
  @ApiProperty() @IsInt() graduation_year: number;
  @ApiProperty() @IsString() notable_field: string;
  @ApiProperty() @IsString() accomplishments: string;
}

// --- Research Hub DTO ---
export class CreateResearchHubDto {
    @ApiProperty() @IsString() center_name: string;
    @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
    @ApiPropertyOptional() @IsOptional() @IsUrl() website_url?: string;
}

// ... other section DTOs for Entrepreneurship, Housing etc. would follow the same pattern ...