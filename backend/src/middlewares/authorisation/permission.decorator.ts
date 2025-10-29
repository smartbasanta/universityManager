import { SetMetadata } from '@nestjs/common';

/**
 * The key used to store permission metadata on a route handler.
 */
export const PERMISSION_KEY = 'permission';

/**
 * Decorator to attach a required permission to a route handler.
 * The PermissionGuard will use this metadata to protect the route.
 *
 * @example
 * @RequirePermission('job:create')
 * @Post()
 * createJob(@Body() createJobDto: CreateJobDto) { ... }
 *
 * @param permission The permission key required to access the route.
 */
export const RequirePermission = (permission: string) =>
  SetMetadata(PERMISSION_KEY, permission);