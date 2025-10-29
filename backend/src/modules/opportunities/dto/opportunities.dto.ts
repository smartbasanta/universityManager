import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { EmploymentType, ExperienceLevel, JobStatus, ModeOfWork } from 'src/model/job.entity';
import { OpportunityLocation, OpportunityScope, OpportunityStatus, OpportunityType } from 'src/model/opportunity.entity';
import { QuestionType as ScholarshipQuestionType } from 'src/model/scholarship_question.entity';
import { JobQuestionType } from 'src/model/job_question.entity';

// --- Generic Question DTO ---
class CreateJobQuestionDto {
    @ApiProperty() @IsNotEmpty() @IsString()
    label: string;

    @ApiProperty({ enum: JobQuestionType }) @IsEnum(JobQuestionType)
    type: JobQuestionType; // <-- Use the correct enum

    @ApiPropertyOptional() @IsOptional() @IsBoolean()
    required?: boolean;
}

class CreateScholarshipQuestionDto {
    @ApiProperty() @IsNotEmpty() @IsString()
    label: string;

    @ApiProperty({ enum: ScholarshipQuestionType }) @IsEnum(ScholarshipQuestionType)
    type: ScholarshipQuestionType; // <-- Use the correct enum

    @ApiPropertyOptional() @IsOptional() @IsBoolean()
    required?: boolean;
}

// --- Job DTOs ---
export class CreateJobDto {
    @ApiProperty() @IsNotEmpty() @IsString() title: string;
    @ApiProperty() @IsNotEmpty() @IsString() description: string;
    @ApiProperty() @IsNotEmpty() @IsString() location: string;
    @ApiProperty({ enum: EmploymentType }) @IsEnum(EmploymentType) employmentType: EmploymentType;
    @ApiProperty({ enum: ExperienceLevel }) @IsEnum(ExperienceLevel) experienceLevel: ExperienceLevel;
    @ApiProperty({ enum: ModeOfWork }) @IsEnum(ModeOfWork) modeOfWork: ModeOfWork;
    @ApiPropertyOptional() @IsOptional() @IsBoolean() hasApplicationForm?: boolean;
    @ApiPropertyOptional({ type: [CreateJobQuestionDto] })
    @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateJobQuestionDto)
    questions?: CreateJobQuestionDto[];
    
    // Scoping Fields
    @ApiPropertyOptional() @IsOptional() @IsUUID() universityId?: string;
    @ApiPropertyOptional() @IsOptional() @IsUUID() institutionId?: string;
    @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string;
}
export class UpdateJobDto extends PartialType(CreateJobDto) {
    @ApiPropertyOptional({ enum: JobStatus }) @IsOptional() @IsEnum(JobStatus) status?: JobStatus;
}

// --- Scholarship DTOs ---
export class CreateScholarshipDto {
    @ApiProperty() @IsNotEmpty() @IsString() name: string;
    @ApiProperty() @IsNotEmpty() @IsString() description: string;
    @ApiPropertyOptional() @IsOptional() @IsString() amount?: number;
    @ApiPropertyOptional() @IsOptional() @IsDateString() deadline?: Date;
    @ApiPropertyOptional({ type: [CreateScholarshipQuestionDto] })
    @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateScholarshipQuestionDto)
    questions?: CreateScholarshipQuestionDto[];
    
    // Scoping Fields
    @ApiPropertyOptional() @IsOptional() @IsUUID() universityId?: string;
    @ApiPropertyOptional() @IsOptional() @IsUUID() institutionId?: string;
    @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string;
}
export class UpdateScholarshipDto extends PartialType(CreateScholarshipDto) {}

// --- Opportunity DTOs ---
export class CreateOpportunityDto {
    @ApiProperty() @IsNotEmpty() @IsString() title: string;
    @ApiProperty() @IsNotEmpty() @IsString() description: string;
    @ApiProperty({ enum: OpportunityType }) @IsEnum(OpportunityType) type: OpportunityType;
    @ApiProperty({ enum: OpportunityLocation }) @IsEnum(OpportunityLocation) location: OpportunityLocation;
    @ApiProperty() @IsDateString() startDateTime: Date;
    @ApiProperty() @IsDateString() endDateTime: Date;
    @ApiProperty() @IsString() applicationLink: string;
    
    // Scoping Fields
    @ApiProperty() @IsEnum(OpportunityScope) scope: OpportunityScope;
    @ApiPropertyOptional() @IsOptional() @IsUUID() universityId?: string;
    @ApiPropertyOptional() @IsOptional() @IsUUID() institutionId?: string;
    @ApiPropertyOptional() @IsOptional() @IsUUID() departmentId?: string;
}
export class UpdateOpportunityDto extends PartialType(CreateOpportunityDto) {
    @ApiPropertyOptional({ enum: OpportunityStatus }) @IsOptional() @IsEnum(OpportunityStatus) status?: OpportunityStatus;
}