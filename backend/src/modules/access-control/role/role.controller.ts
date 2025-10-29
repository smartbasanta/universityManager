import { Controller, Get, Post, Body, Delete, Param, UseGuards, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { RoleService } from './role.service';
import { UpdateRolePermissionsDto, AssignRoleToUserDto, SyncUserRolesDto, BulkAssignRolesDto, BulkRemoveRolesDto } from './dto/role-management.dto';
// import { AtGuard } from 'src/middlewares/access_token/at.guard';
// import { Roles } from '../decorators/roles.decorator';

@ApiTags('Access Control - Roles')
@ApiBearerAuth('access-token')
// @UseGuards(AtGuard)
@Controller('access-control/roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Get()
  @ApiOperation({ summary: 'Get a list of all available roles' })
  findAllRoles() {
    return this.roleService.findAll();
  }

  @Post('update-permissions')
  @ApiOperation({ summary: 'Set/Reset the permissions for a role' })
  // @Roles('SUPER_ADMIN')
  updateRolePermissions(@Body() dto: UpdateRolePermissionsDto) {
    const { roleKey, permissionKeys } = dto;
    return this.roleService.updateRolePermissions(roleKey, permissionKeys);
  }

  @Post('assign-to-user')
  @ApiOperation({ summary: 'Assign a role to a user within a specific scope' })
  // @Roles('SUPER_ADMIN', 'UNIVERSITY_ADMIN')
  assignRoleToUser(@Body() dto: AssignRoleToUserDto) {
    const { userId, roleKey, scope, expiresAt } = dto;
    return this.roleService.assignRoleToUser(userId, roleKey, scope, expiresAt);
  }

  @Delete('remove-from-user/:assignmentId')
  @ApiOperation({ summary: 'Remove a role assignment from a user' })
  // @Roles('SUPER_ADMIN', 'UNIVERSITY_ADMIN')
  removeRoleFromUser(@Param('assignmentId') assignmentId: string) {
    return this.roleService.removeRoleFromUser(assignmentId);
  }

  // --- NEW SYNCHRONIZATION ENDPOINT ---
  @Put('sync-for-user')
  @ApiOperation({ summary: "Synchronize a user's roles to an exact list of assignments" })
  syncUserRoles(@Body() dto: SyncUserRolesDto) {
    return this.roleService.syncUserRoles(dto.userId, dto.assignments);
  }

  // --- NEW BULK ENDPOINTS ---
  @Post('assign-multiple-to-user')
  @ApiOperation({ summary: 'Assign multiple roles to a user under a single scope' })
  assignMultipleRoles(@Body() dto: BulkAssignRolesDto) {
    return this.roleService.assignMultipleRolesToUser(dto.userId, dto.roleKeys, dto.scope);
  }

  @Post('remove-multiple-from-user') // Using POST for a body on a delete operation
  @ApiOperation({ summary: 'Remove multiple role assignments by their IDs' })
  removeMultipleRoles(@Body() dto: BulkRemoveRolesDto) {
    return this.roleService.removeMultipleRolesFromUser(dto.assignmentIds);
  }
}