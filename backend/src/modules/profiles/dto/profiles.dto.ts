import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsArray, IsDateString, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUrl, IsUUID, Min } from 'class-validator';
import { PersonStatus, UserStatus } from 'src/helper/enums/user-status.enum';

// --- STUDENT DTOs ---
export class CreateStudentProfileDto {
  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiPropertyOptional() @IsOptional() @IsDateString() date_of_birth?: Date;
  @ApiPropertyOptional() @IsOptional() @IsInt() @Min(1950) enrollmentYear?: number;
  @ApiProperty() @IsUUID() universityId: string;
  @ApiProperty() @IsUUID() programId: string;
}
export class UpdateStudentProfileDto extends PartialType(CreateStudentProfileDto) {
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
}

// --- STAFF DTOs ---
export class CreateStaffProfileDto {
  @ApiProperty() @IsNotEmpty() @IsString() name: string;
  @ApiProperty() @IsNotEmpty() @IsString() job_title: string;
  @ApiProperty() @IsUUID() universityId: string;
  @ApiPropertyOptional({ description: 'Required if the staff member is scoped to a specific department.' })
  @IsOptional() @IsUUID() departmentId?: string;
}
export class UpdateStaffProfileDto extends PartialType(CreateStaffProfileDto) {
  @ApiPropertyOptional() @IsOptional() @IsString() address?: string;
  @ApiPropertyOptional() @IsOptional() @IsString() phone?: string;
}
export class UpdateUserStatusDto {
    @ApiProperty({ enum: UserStatus, description: 'Status for Staff or Ambassadors' }) @IsEnum(UserStatus) status: UserStatus;
}

// --- MENTOR DTOs ---
export class CreateMentorProfileDto {
    @ApiProperty() @IsNotEmpty() @IsString() name: string;
    @ApiProperty() @IsNotEmpty() @IsString() about: string;
    @ApiPropertyOptional() @IsOptional() @IsUrl() linkedin_url?: string;
    @ApiPropertyOptional() @IsOptional() @IsUrl() meeting_url?: string;
    @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) languages?: string[];
    @ApiPropertyOptional() @IsOptional() @IsString() education?: string;
    @ApiPropertyOptional({ type: [String] }) @IsOptional() @IsArray() @IsString({ each: true }) expertise_areas?: string[];
    @ApiProperty() @IsUUID() universityId: string;
}
export class UpdateMentorProfileDto extends PartialType(CreateMentorProfileDto) {}
export class UpdatePersonStatusDto {
    @ApiProperty({ enum: PersonStatus, description: 'Status for Mentors' }) @IsEnum(PersonStatus) status: PersonStatus;
}