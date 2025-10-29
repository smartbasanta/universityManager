import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDateString, IsNotEmpty, IsArray } from 'class-validator';

export class AssignPermissionToUserDto {
  @ApiProperty({ description: 'The unique ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The key of the permission to assign (e.g., "job:publish")' })
  @IsString()
  @IsNotEmpty()
  permissionKey: string;

  @ApiProperty({ description: 'Optional expiration date for the permission', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}

export class RevokePermissionFromUserDto {
  @ApiProperty({ description: 'The unique ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The key of the permission to revoke' })
  @IsString()
  @IsNotEmpty()
  permissionKey: string;

  @ApiProperty({ description: 'Optional reason for the revocation', required: false })
  @IsOptional()
  @IsString()
  reason?: string;
}

export class BulkUpdatePermissionsDto {
  @ApiProperty({ description: 'The unique ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({
    description: 'An array of permission keys to be assigned or revoked (e.g., ["job:publish", "news:edit"])',
    type: [String],
  })
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];
}

export class BulkAssignPermissionsDto {
  @ApiProperty({ description: 'The unique ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'An array of permission keys to assign (e.g., ["job:publish", "news:edit"])' })
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];
}

export class BulkRevokePermissionsDto {
  @ApiProperty({ description: 'The unique ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'An array of permission keys to revoke' })
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];
}