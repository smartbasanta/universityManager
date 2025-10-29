import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsOptional,
  IsString,
  IsUrl,
  ValidateNested,
  IsObject,
  IsBooleanString,
  IsInt,
  IsEnum,
} from 'class-validator';
import { GenderCategory } from 'src/model/sports_team.entity';

export class UniversitySportsFacilityDto {
  @ApiProperty({
    description: 'Name of sports facility',
    example: 'Eagle Athletic Complex',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Website URL for sports facility',
    example: 'https://university.edu/athletics/facilities',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  website?: string;
}

export class IntramuralSportDto {
  @ApiProperty({
    description: 'Name of intramural sport',
    example: 'Flag Football',
    required: false,
  })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({
    description: 'Website URL for intramural sport information',
    example: 'https://university.edu/athletics/intramurals/flag-football',
    required: false,
  })
  @IsOptional()
  @IsUrl()
  link?: string;
}

class TeamAchievementDto {
    @ApiProperty() @IsInt() year: number;
    @ApiProperty() @IsString() achievement: string;
}

class CreateSportsTeamDto {
    @ApiProperty() @IsString() sport_name: string;
    @ApiProperty({ enum: GenderCategory }) @IsEnum(GenderCategory) gender: GenderCategory;
    @ApiProperty({ required: false }) @IsOptional() @IsString() head_coach?: string;
    @ApiProperty({ type: [TeamAchievementDto], required: false })
    @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => TeamAchievementDto)
    achievements?: TeamAchievementDto[];
}

export class UpdateSportsDto {
  @ApiProperty({ required: false }) @IsOptional() @IsString() athletic_division: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() conference: string;
  @ApiProperty({ required: false }) @IsOptional() @IsString() mascot: string;

  @ApiProperty({ type: [CreateSportsTeamDto], required: false })
  @IsOptional() @IsArray() @ValidateNested({ each: true }) @Type(() => CreateSportsTeamDto)
  teams: CreateSportsTeamDto[];
  
  // You would also have DTOs for facilities, etc.
}
