import { Controller, Post, Body, Delete, UseGuards, Param, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { PermissionService } from './permission.service';
import { AssignPermissionToUserDto, RevokePermissionFromUserDto, BulkAssignPermissionsDto, BulkRevokePermissionsDto  } from './dto/permission-assignment.dto';
// import { AtGuard } from 'src/middlewares/access_token/at.guard';
// import { RolesGuard } from '../guards/roles.guard'; // Example Guard
// import { Roles } from '../decorators/roles.decorator'; // Example Decorator

@ApiTags('Access Control - Permissions')
@ApiBearerAuth('access-token')
// @UseGuards(AtGuard, RolesGuard) // Protect all routes
@Controller('access-control/permissions')
export class PermissionController {
  constructor(private readonly permissionService: PermissionService) {}

  @Post('assign-to-user')
  @ApiOperation({ summary: 'Directly assign a permission to a user' })
  // @Roles('SUPER_ADMIN', 'UNIVERSITY_ADMIN') // Example role protection
  assignPermissionToUser(@Body() dto: AssignPermissionToUserDto) {
    const { userId, permissionKey, expiresAt } = dto;
    return this.permissionService.assignPermissionToUser(userId, permissionKey, expiresAt);
  }

  @Post('revoke-from-user')
  @ApiOperation({ summary: 'Revoke a permission from a user, overriding their roles' })
  // @Roles('SUPER_ADMIN', 'UNIVERSITY_ADMIN')
  revokePermissionFromUser(@Body() dto: RevokePermissionFromUserDto) {
    const { userId, permissionKey, reason } = dto;
    return this.permissionService.revokePermissionFromUser(userId, permissionKey, reason);
  }

  @Delete('remove-direct-from-user/:userId/:permissionKey')
  @ApiOperation({ summary: 'Remove a direct permission assignment from a user' })
  // @Roles('SUPER_ADMIN', 'UNIVERSITY_ADMIN')
  removeDirectPermission(
    @Param('userId') userId: string,
    @Param('permissionKey') permissionKey: string,
  ) {
    return this.permissionService.removeDirectPermissionFromUser(userId, permissionKey);
  }

  @Delete('remove-revocation-from-user/:userId/:permissionKey')
  @ApiOperation({ summary: 'Remove a permission revocation from a user' })
  // @Roles('SUPER_ADMIN', 'UNIVERSITY_ADMIN')
  removeRevocation(
    @Param('userId') userId: string,
    @Param('permissionKey') permissionKey: string,
  ) {
    return this.permissionService.removeRevokedPermissionFromUser(userId, permissionKey);
  }

  // --- NEW SYNCHRONIZATION ENDPOINTS ---
  @Put('sync-direct-for-user')
  @ApiOperation({ summary: "Synchronize a user's direct permissions to an exact list" })
  syncDirectPermissions(@Body() dto: BulkAssignPermissionsDto) {
    return this.permissionService.syncDirectUserPermissions(dto.userId, dto.permissionKeys);
  }
  
  @Put('sync-revoked-for-user')
  @ApiOperation({ summary: "Synchronize a user's revoked permissions to an exact list" })
  syncRevokedPermissions(@Body() dto: BulkRevokePermissionsDto) {
    return this.permissionService.syncRevokedUserPermissions(dto.userId, dto.permissionKeys);
  }

  // --- NEW BULK ADDITIVE ENDPOINTS ---
  @Post('assign-multiple-to-user')
  @ApiOperation({ summary: 'Directly assign multiple permissions to a user' })
  assignMultiplePermissions(@Body() dto: BulkAssignPermissionsDto) {
    return this.permissionService.assignMultiplePermissionsToUser(dto.userId, dto.permissionKeys);
  }

  @Post('revoke-multiple-from-user')
  @ApiOperation({ summary: 'Revoke multiple permissions from a user' })
  revokeMultiplePermissions(@Body() dto: BulkRevokePermissionsDto) {
    return this.permissionService.revokeMultiplePermissionsFromUser(dto.userId, dto.permissionKeys);
  }
}