import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray, IsBoolean, IsDateString, IsDecimal, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl,
  ValidateNested, MaxLength, Min, Max
} from 'class-validator';
import { ProgramLevel } from 'src/model/program.entity';
import { AdmissionLevel } from 'src/model/university_admission.entity';
import { RequirementType } from 'src/model/university_admission_requirement.entity';
import { ResidencyType } from 'src/model/university_tuition.entity';

// --- Sub-DTOs for nested entities ---

class CreateUniversityOverviewDto {
  @ApiPropertyOptional() @IsOptional() @IsString()
  student_faculty_ratio?: string;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  research_expenditure?: number;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  endowment?: number;

  @ApiPropertyOptional() @IsOptional() @IsString()
  university_type?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  campus_setting?: string;

  @ApiProperty() @IsNotEmpty() @IsString()
  country: string;

  @ApiProperty() @IsNotEmpty() @IsString()
  state: string;

  @ApiProperty() @IsNotEmpty() @IsString()
  city: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  zip_code?: string;
}

class CreateAdmissionRequirementDto {
  @ApiProperty() @IsString()
  name: string;

  @ApiProperty({ enum: RequirementType }) @IsEnum(RequirementType)
  type: RequirementType;

  @ApiPropertyOptional() @IsOptional() @IsString()
  description?: string;

  @ApiPropertyOptional() @IsOptional() @IsBoolean()
  is_required?: boolean;

  @ApiPropertyOptional() @IsOptional() @IsString()
  percentile_25?: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  percentile_75?: string;
}

class CreateUniversityAdmissionDto {
  @ApiProperty({ enum: AdmissionLevel }) @IsEnum(AdmissionLevel)
  level: AdmissionLevel;

  @ApiPropertyOptional() @IsOptional() @IsNumber() @Min(0) @Max(100)
  acceptance_rate?: number;

  @ApiPropertyOptional() @IsOptional() @IsDateString()
  application_deadline?: Date;

  @ApiPropertyOptional() @IsOptional() @IsNumber()
  application_fee?: number;
  
  @ApiPropertyOptional() @IsOptional() @IsUrl()
  application_website?: string;

  @ApiProperty({ type: [CreateAdmissionRequirementDto] })
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateAdmissionRequirementDto)
  requirements: CreateAdmissionRequirementDto[];
}

class CreateUniversityTuitionDto {
  @ApiProperty({ enum: ProgramLevel }) @IsEnum(ProgramLevel)
  level: ProgramLevel;

  @ApiProperty({ enum: ResidencyType }) @IsEnum(ResidencyType)
  residency: ResidencyType;

  @ApiProperty() @IsInt() @Min(2000)
  academic_year: number;

  @ApiProperty() @IsDecimal()
  tuition_and_fees: number;

  @ApiPropertyOptional() @IsOptional() @IsDecimal()
  books_and_supplies_cost?: number;
  
  @ApiPropertyOptional() @IsOptional() @IsDecimal()
  housing_cost?: number;

  @ApiPropertyOptional() @IsOptional() @IsDecimal()
  meal_plan_cost?: number;
}

class CreateUniversityRankingDto {
    @ApiProperty() @IsString()
    source: string;
  
    @ApiProperty() @IsInt()
    year: number;
  
    @ApiProperty() @IsString()
    subject: string;
  
    @ApiProperty() @IsString()
    rank: string;
}


// --- Main University DTO ---

export class CreateUniversityDto {
  @ApiProperty() @IsNotEmpty() @IsString()
  university_name: string;

  @ApiPropertyOptional() @IsOptional() @IsString()
  about: string | null;
  
  @ApiPropertyOptional() @IsOptional() @IsString()
  mission_statement: string | null;

  @ApiPropertyOptional() @IsOptional() @IsUrl()
  website: string | null;

  @ApiProperty({ description: 'The core overview details of the university.' })
  @ValidateNested() @Type(() => CreateUniversityOverviewDto)
  overview: CreateUniversityOverviewDto;

  @ApiProperty({ type: [CreateUniversityAdmissionDto], description: 'List of admission details (e.g., for undergraduate and graduate).' })
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateUniversityAdmissionDto)
  admissions: CreateUniversityAdmissionDto[];

  @ApiProperty({ type: [CreateUniversityTuitionDto], description: 'List of tuition fees for different levels and residencies.' })
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateUniversityTuitionDto)
  tuition_fees: CreateUniversityTuitionDto[];

  @ApiPropertyOptional({ type: [CreateUniversityRankingDto], description: 'List of university rankings.' })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateUniversityRankingDto)
  rankings?: CreateUniversityRankingDto[];
}