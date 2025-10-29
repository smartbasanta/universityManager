import { ApiProperty } from '@nestjs/swagger';
import { IsUUID, IsString, IsOptional, IsDateString, IsArray, IsNotEmpty, ValidateNested } from 'class-validator';
import { PermissionScope } from '../../permission/permission.service';
import { Type } from 'class-transformer';

export class UpdateRolePermissionsDto {
  @ApiProperty({ description: 'The key of the role to update' })
  @IsString()
  @IsNotEmpty()
  roleKey: string;

  @ApiProperty({ description: 'An array of permission keys to assign to the role. This will overwrite existing permissions.' })
  @IsArray()
  @IsString({ each: true })
  permissionKeys: string[];
}

export class AssignRoleToUserDto {
  @ApiProperty({ description: 'The unique ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'The key of the role to assign' })
  @IsString()
  @IsNotEmpty()
  roleKey: string;

  @ApiProperty({ description: 'The scope of this role assignment. Only one scope ID should be provided.' })
  @IsOptional()
  scope?: PermissionScope; // { universityId?, institutionId?, departmentId? }

  @ApiProperty({ description: 'Optional expiration date for the role assignment', required: false })
  @IsOptional()
  @IsDateString()
  expiresAt?: Date;
}


export class BulkAssignRolesDto {
  @ApiProperty({ description: 'The unique ID of the user' })
  @IsUUID()
  userId: string;

  @ApiProperty({ description: 'An array of role keys to assign' })
  @IsArray()
  @IsString({ each: true })
  roleKeys: string[];

  @ApiProperty({ description: 'The single scope to apply to all role assignments in this request.' })
  @IsNotEmpty()
  scope: PermissionScope;
}

export class BulkRemoveRolesDto {
  @ApiProperty({ description: 'An array of unique UserRoleAssignmentEntity IDs to remove' })
  @IsArray()
  @IsUUID('4', { each: true })
  assignmentIds: string[];
}

// --- DTO for Synchronization ---
class RoleAssignmentPayload {
  @ApiProperty({ description: 'The key of the role to assign' })
  @IsString()
  roleKey: string;

  @ApiProperty({ description: 'The scope for this specific role assignment' })
  @IsNotEmpty()
  scope: PermissionScope;
}

export class SyncUserRolesDto {
  @ApiProperty({ description: 'The unique ID of the user whose roles will be synchronized' })
  @IsUUID()
  userId: string;

  @ApiProperty({ type: [RoleAssignmentPayload], description: 'The exact list of role assignments the user should have' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoleAssignmentPayload)
  assignments: RoleAssignmentPayload[];
}