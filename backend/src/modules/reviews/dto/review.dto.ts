import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty() @IsUUID() universityId: string;
  @ApiProperty() @IsNotEmpty() @IsString() comment: string;
  @ApiProperty() @IsInt() @Min(1) @Max(5) rating: number;
}

export class UpdateReviewDto {
  @ApiProperty() @IsNotEmpty() @IsString() comment: string;
  @ApiProperty() @IsInt() @Min(1) @Max(5) rating: number;
}