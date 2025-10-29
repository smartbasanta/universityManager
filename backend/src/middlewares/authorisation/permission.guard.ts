import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSION_KEY } from './permission.decorator';
import { PermissionService } from 'src/modules/access-control/permission/permission.service'; // Adjust path if needed

@Injectable()
export class PermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Get the required permission from the decorator metadata
    const requiredPermission = this.reflector.get<string>(
      PERMISSION_KEY,
      context.getHandler(),
    );

    // If no @RequirePermission decorator is present, allow access by default.
    // This makes the guard opt-in for protection.
    if (!requiredPermission) {
      return true;
    }

    // 2. Get the user object from the request
    const request = context.switchToHttp().getRequest();
    const user = request.user; // Assumes your authentication guard (e.g., AtGuard) has attached this.

    if (!user || !user.sub) {
      // This should not happen if the authentication guard runs first.
      throw new InternalServerErrorException(
        'User object not found on the request. Ensure an authentication guard is active.',
      );
    }

    // 3. Construct the scope from the request parameters
    // This allows for context-aware permission checking.
    const params = request.params;
    const scope = {
      universityId: params.universityId || params.id, // Handles both /universities/:id and /universities/:universityId/...
      departmentId: params.departmentId,
      institutionId: params.institutionId,
    };

    // 4. Defer the complex logic to the PermissionService
    const hasPermission = await this.permissionService.userHasPermission(
      user.sub, // The user's ID
      requiredPermission,
      scope,
    );

    // 5. Grant or deny access
    if (hasPermission) {
      return true;
    } else {
      throw new ForbiddenException(
        `You do not have the required permission (${requiredPermission}) to perform this action.`,
      );
    }
  }
}