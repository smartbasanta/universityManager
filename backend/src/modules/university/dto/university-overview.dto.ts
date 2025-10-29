import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, ValidateNested, IsInt } from 'class-validator';
import { Type } from 'class-transformer';
class AcceptanceRateDto {
@ApiProperty() @IsString() type: string; // e.g., 'First-Year'
@ApiProperty() @IsInt() year: number;
@ApiProperty() @IsNumber() rate: number; // e.g., 45.5
}
export class UpdateUniversityOverviewDto {
@ApiProperty({ required: false }) @IsOptional() @IsString() student_faculty_ratio: string;
@ApiProperty({ required: false }) @IsOptional() @IsNumber() research_expenditure: number;
@ApiProperty({ required: false }) @IsOptional() @IsNumber() endowment: number;
@ApiProperty({ required: false }) @IsOptional() @IsString() university_type: string;
@ApiProperty({ required: false }) @IsOptional() @IsString() campus_setting: string;
@ApiProperty({ required: false }) @IsOptional() @IsString() country: string;
@ApiProperty({ required: false }) @IsOptional() @IsString() state: string;
@ApiProperty({ required: false }) @IsOptional() @IsString() city: string;
@ApiProperty({ required: false }) @IsOptional() @IsString() zip_code: string;
@ApiProperty({ type: [AcceptanceRateDto], required: false })
@IsOptional() @ValidateNested({ each: true }) @Type(() => AcceptanceRateDto)
acceptance_rates: AcceptanceRateDto[];
}