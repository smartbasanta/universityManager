import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsNotEmpty } from 'class-validator';

export class PublishUniversityDto {
  @ApiProperty({
    description: 'Set to true to publish the profile, false to unpublish.',
    example: true,
  })
  @IsBoolean()
  @IsNotEmpty()
  is_published: boolean;
}