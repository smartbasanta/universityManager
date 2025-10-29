import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';
import { NewsStatus } from 'src/helper/types/index.type';
import { CommentStatus } from 'src/model/comment.entity';

export class CreateResearchNewsDto {
  @ApiProperty() @IsNotEmpty() @IsString() title: string;
  @ApiProperty() @IsNotEmpty() @IsString() abstract: string;
  @ApiProperty() @IsNotEmpty() @IsString() article: string;
  @ApiProperty() @IsNotEmpty() @IsString() category: string;
  @ApiPropertyOptional() @IsOptional() @IsString({ each: true }) tags?: string[];
  @ApiPropertyOptional() @IsOptional() @IsString() paperLink?: string;
  @ApiPropertyOptional() @IsOptional() @IsUUID() universityId?: string;
}
export class UpdateResearchNewsDto extends PartialType(CreateResearchNewsDto) {
  @ApiPropertyOptional({ enum: NewsStatus }) @IsOptional() @IsEnum(NewsStatus) status?: NewsStatus;
}

export class CreateCommentDto {
  @ApiProperty() @IsNotEmpty() @IsString() text: string;
  @ApiProperty({ description: 'The ID of the entity being commented on (e.g., a research_news ID)' })
  @IsUUID() related_entity_id: string;
  @ApiProperty({ description: 'The type of the entity', example: 'research_news' })
  @IsIn(['research_news']) // Restrict to valid types
  related_entity_type: string;
  @ApiPropertyOptional({ description: 'The ID of the parent comment if this is a reply' })
  @IsOptional() @IsUUID() parentCommentId?: string;
}
export class UpdateCommentStatusDto {
    @ApiProperty({ enum: CommentStatus }) @IsEnum(CommentStatus) status: CommentStatus;
}

export class CreateReviewDto {
  @ApiProperty({ description: 'Rating from 1 to 5' }) @IsInt() @Min(1) @Max(5) rating: number;
  @ApiProperty() @IsNotEmpty() @IsString() comment: string;
  @ApiProperty() @IsUUID() universityId: string;
}