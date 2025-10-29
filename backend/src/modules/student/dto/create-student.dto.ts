import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class CreateStudentDto {
  @ApiProperty()
  @IsString()
  password: string;

  @ApiProperty()
  @IsString()
  name: string;

  // @ApiProperty()
  // @IsString()
  // address: string;

  // @ApiProperty({ required: false, type: 'string', format: 'binary' })
  // @IsOptional()
  // photo: any;

  // @ApiProperty()
  // @IsString()
  // phone: string;

  // @ApiProperty()
  // @IsString()
  // date_of_birth: string;
}
