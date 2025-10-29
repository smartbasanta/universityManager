import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsEmail, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Min } from 'class-validator';
import { ProgramLevel } from 'src/model/program.entity';

export class CreateDepartmentDto {
  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiProperty() @IsUUID() universityId: string;
}

export class CreateProgramDto {
  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiProperty({ enum: ProgramLevel }) @IsNotEmpty() level: ProgramLevel;
  @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() duration?: string;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(0) total_credits?: number;
  @ApiProperty() @IsUUID() departmentId: string;
}

// --- FACULTY DTO ---
export class CreateFacultyDto {
    @ApiProperty() @IsNotEmpty() @IsString() name: string;
    @ApiProperty() @IsNotEmpty() @IsString() title: string;
    @ApiPropertyOptional() @IsOptional() @IsString() bio?: string;
    @ApiPropertyOptional() @IsOptional() @IsEmail() email?: string;
    @ApiPropertyOptional() @IsOptional() @IsString() office_location?: string;
    @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true })
    research_interests?: string[];
    @ApiProperty() @IsUUID() departmentId: string;
}

// --- COURSE DTO ---
export class CreateCourseDto {
    @ApiProperty() @IsNotEmpty() @IsString() course_code: string;
    @ApiProperty() @IsNotEmpty() @IsString() title: string;
    @ApiPropertyOptional() @IsOptional() @IsString() description?: string;
    @ApiProperty() @IsInt() @Min(0) credits: number;
    @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true })
    semestersOffered?: string[];
    @ApiProperty() @IsUUID() programId: string;
    @ApiPropertyOptional() @IsOptional() @IsUUID() instructorId?: string;
    @ApiPropertyOptional({ type: [String], description: 'Array of Course IDs that are prerequisites' })
    @IsOptional() @IsArray() @IsUUID('4', { each: true })
    prerequisiteIds?: string[];
}