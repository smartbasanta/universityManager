import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InstitutionEntity } from 'src/model/institution.entity';
import { AuthEntity } from 'src/model/auth.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { PermissionEntity } from 'src/model/permission.entity';
import { RevokedPermissionEntity } from 'src/model/revoked_permission.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { UserDirectPermissionEntity } from 'src/model/user_direct_permission.entity';
import { UserRoleAssignmentEntity } from 'src/model/user_role_assignment.entity';
import { Brackets, Repository, SelectQueryBuilder, ObjectLiteral, In } from 'typeorm';

// --- NEW ---
// This configuration tells the service how to map scopes to the entity's columns.
export type ScopeFilteringConfig = {
  // 'scope_name': 'column_name_on_entity'
  university?: string;   // e.g., 'universityId'
  institution?: string;  // e.g., 'institutionId'
  department?: string;   // e.g., 'id' for DepartmentEntity, 'departmentId' for StaffEntity
};

// Define a type for the scope object for clarity
export type PermissionScope = {
  universityId?: string;
  departmentId?: string;
  institutionId?: string;
};

export type UserPermissionScopes = {
  hasGlobalScope: boolean; // True if the user is a super-admin
  universityIds: string[];
  departmentIds: string[];
  institutionIds: string[];
};

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,
    @InjectRepository(UniversityEntity)
    private readonly universityRepository: Repository<UniversityEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(UserDirectPermissionEntity)
    private readonly directPermissionRepository: Repository<UserDirectPermissionEntity>,
    @InjectRepository(RevokedPermissionEntity)
    private readonly revokedPermissionRepository: Repository<RevokedPermissionEntity>,
  ) {}

  /**
   * Retrieves all effective permissions for a user.
   * It calculates this by taking permissions from roles, adding direct permissions,
   * and finally subtracting any revoked permissions.
   * @param userId The ID of the user.
   * @returns A string array of unique permission keys.
   */
  async getAllUserPermissions(userId: string): Promise<string[]> {
    const user = await this.fetchUserWithPermissions(userId);
    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const permissions = new Set<string>();
    const now = new Date();

    // 1. Add permissions from all non-expired roles
    user.roleAssignments.forEach((assignment) => {
      if (!assignment.expiresAt || assignment.expiresAt > now) {
        assignment.role.permissions.forEach((p) => permissions.add(p.name));
      }
    });

    // 2. Add all non-expired direct permissions
    user.directPermissions.forEach((directPermission) => {
      if (!directPermission.expiresAt || directPermission.expiresAt > now) {
        permissions.add(directPermission.permission.name);
      }
    });

    // 3. Remove all revoked permissions
    user.revokedPermissions.forEach((revoked) => {
      permissions.delete(revoked.permission.name);
    });

    return Array.from(permissions);
  }

  /**
   * Checks if a user has a specific permission within a given scope.
   * The logic follows a strict precedence: Revoked > Direct > Role-based.
   * @param userId The user's ID.
   * @param requiredPermission The permission key to check (e.g., 'job:create').
   * @param scope The scope in which the permission is required.
   * @returns A boolean indicating if the user has the permission.
   */
  async userHasPermission(
    userId: string,
    requiredPermission: string,
    scope: PermissionScope = {},
  ): Promise<boolean> {
    const user = await this.fetchUserWithPermissions(userId);
    if (!user) {
      return false;
    }

    const now = new Date();

    // 1. Check for Revocations (Absolute Priority)
    // If the permission is explicitly revoked, access is always denied.
    const isRevoked = user.revokedPermissions.some(
      (p) => p.permission.name === requiredPermission,
    );
    if (isRevoked) {
      return false;
    }

    // 2. Check for Direct Permissions (Second Priority)
    // Direct permissions are typically global and override role scopes.
    const hasDirectPermission = user.directPermissions.some(
      (p) =>
        p.permission.name === requiredPermission &&
        (!p.expiresAt || p.expiresAt > now),
    );
    if (hasDirectPermission) {
      return true;
    }

    // 3. Check Role-Based Permissions within Scope (Third Priority)
    for (const assignment of user.roleAssignments) {
      // Skip expired role assignments
      if (assignment.expiresAt && assignment.expiresAt <= now) {
        continue;
      }

      // Check if the role contains the required permission
      const hasPermissionInRole = assignment.role.permissions.some(
        (p) => p.name === requiredPermission,
      );

      if (hasPermissionInRole) {
        // If the role has the permission, check if the assignment's scope matches the requirement
        const scopeMatch = await this.isScopeMatch(assignment, scope);
        if (scopeMatch) {
          return true; // Permission granted
        }
      }
    }

    return false; // If no checks pass, deny by default
  }

  /**
   * Fetches the user with all necessary RBAC relations.
   * @private
   */
  private async fetchUserWithPermissions(userId: string): Promise<AuthEntity> {
    return this.authRepository.findOneOrFail({
      where: { id: userId },
      relations: {
        revokedPermissions: { permission: true },
        directPermissions: { permission: true },
        roleAssignments: {
          role: { permissions: true },
          universityScope: true,
          departmentScope: true,
          institutionScope: true,
        },
      },
    });
  }

  /**
   * Determines if a role assignment's scope satisfies the required scope,
   * including hierarchical checks (e.g., University scope covers its Departments).
   * @private
   */
  private async isScopeMatch(
    assignment: UserRoleAssignmentEntity,
    requiredScope: PermissionScope,
  ): Promise<boolean> {
    // Case A: Global Scope (Super Admin)
    // If an assignment has no scope, it's global and grants permission everywhere.
    if (
      !assignment.universityScope &&
      !assignment.departmentScope &&
      !assignment.institutionScope
    ) {
      return true;
    }

    // Case B: University Scope Check
    if (assignment.universityScope) {
      // Direct match
      if (assignment.universityScope.id === requiredScope.universityId) {
        return true;
      }
      // Hierarchical match: University scope covers its own departments
      if (requiredScope.departmentId) {
        const dept = await this.departmentRepository.findOne({
            where: { id: requiredScope.departmentId },
            relations: { university: true }
        });
        if (dept?.university?.id === assignment.universityScope.id) {
            return true;
        }
      }
      // Hierarchical match: University scope covers its own institutions
      if (requiredScope.institutionId) {
        const inst = await this.institutionRepository.findOne({
            /* Assuming Institution has a relation to University */
            // where: { id: requiredScope.institutionId, university: { id: assignment.universityScope.id } }
        });
        // if (inst) return true; // Add this logic if Institution is under University
      }
    }

    // Case C: Institution Scope Check
    if (
      assignment.institutionScope &&
      assignment.institutionScope.id === requiredScope.institutionId
    ) {
      return true;
    }

    // Case D: Department Scope Check
    if (
      assignment.departmentScope &&
      assignment.departmentScope.id === requiredScope.departmentId
    ) {
      return true;
    }

    return false;
  }


  // --- NEW HELPER METHOD ---
  /**
   * Gathers all scopes assigned to a user through their roles.
   * This is more efficient than checking permissions one by one when filtering a list.
   * @param userId The ID of the user.
   * @returns A UserPermissionScopes object.
   */
  async getUserPermissionScopes(userId: string): Promise<UserPermissionScopes> {
    const user = await this.authRepository.findOne({
      where: { id: userId },
      relations: {
        roleAssignments: {
          universityScope: true,
          departmentScope: true,
          institutionScope: true, // Ensure this is loaded
        },
      },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${userId} not found.`);
    }

    const result: UserPermissionScopes = {
      hasGlobalScope: false,
      universityIds: [],
      departmentIds: [],
      institutionIds: [], // Added
    };

    // Use Sets to automatically handle duplicates
    const universityIdSet = new Set<string>();
    const departmentIdSet = new Set<string>();
    const institutionIdSet = new Set<string>(); // Added

    for (const assignment of user.roleAssignments) {
      if (!assignment.universityScope && !assignment.departmentScope && !assignment.institutionScope) {
        return { hasGlobalScope: true, universityIds: [], departmentIds: [], institutionIds: [] };
      }

      if (assignment.universityScope) universityIdSet.add(assignment.universityScope.id);
      if (assignment.departmentScope) departmentIdSet.add(assignment.departmentScope.id);
      if (assignment.institutionScope) institutionIdSet.add(assignment.institutionScope.id); // Added
    }

    result.universityIds = Array.from(universityIdSet);
    result.departmentIds = Array.from(departmentIdSet);
    result.institutionIds = Array.from(institutionIdSet); // Added

    return result;
  }

  /**
   * Directly assigns a permission to a user, overriding any potential revocation.
   * This is for granting a specific, one-off permission.
   */
  async assignPermissionToUser(
    userId: string,
    permissionKey: string,
    expiresAt: Date | null = null,
  ): Promise<UserDirectPermissionEntity> {
    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');

    const permission = await this.permissionRepository.findOneBy({ key: permissionKey });
    if (!permission) throw new NotFoundException(`Permission with key "${permissionKey}" not found.`);

    // Business Rule: A direct assignment must override a revocation.
    // First, remove any existing revocation for this permission.
    await this.removeRevokedPermissionFromUser(userId, permissionKey);

    // Prevent duplicate direct permissions.
    const existingDirect = await this.directPermissionRepository.findOneBy({
        user: { id: userId },
        permission: { id: permission.id }
    });
    if (existingDirect) {
        throw new ConflictException('This permission is already directly assigned to the user.');
    }
    
    const directPermission = this.directPermissionRepository.create({
      user,
      permission,
      expiresAt,
    });

    return this.directPermissionRepository.save(directPermission);
  }

  /**
   * Revokes a permission from a user. This takes the highest precedence and will
   * deny access even if a role grants the permission.
   */
  async revokePermissionFromUser(
    userId: string,
    permissionKey: string,
    reason: string | null = null,
  ): Promise<RevokedPermissionEntity> {
    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');
    
    const permission = await this.permissionRepository.findOneBy({ key: permissionKey });
    if (!permission) throw new NotFoundException(`Permission with key "${permissionKey}" not found.`);

    // Business Rule: A revocation must override a direct grant.
    // First, remove any existing direct assignment of this permission.
    await this.removeDirectPermissionFromUser(userId, permissionKey);

    const existingRevocation = await this.revokedPermissionRepository.findOneBy({
        user: { id: userId },
        permission: { id: permission.id }
    });
    if (existingRevocation) {
        throw new ConflictException('This permission is already revoked for the user.');
    }

    const revokedPermission = this.revokedPermissionRepository.create({
      user,
      permission,
      reason,
    });
    
    return this.revokedPermissionRepository.save(revokedPermission);
  }

  /**
   * Removes a direct permission assignment from a user.
   */
  async removeDirectPermissionFromUser(userId: string, permissionKey: string): Promise<{ message: string }> {
    const directPermission = await this.directPermissionRepository.findOne({
        where: { user: { id: userId }, permission: { key: permissionKey } },
    });
    
    if (directPermission) {
        await this.directPermissionRepository.remove(directPermission);
    }
    
    return { message: 'Direct permission removed successfully.' };
  }

  /**
   * Removes a permission revocation, effectively restoring the user's access
   * to the state defined by their roles.
   */
  async removeRevokedPermissionFromUser(userId: string, permissionKey: string): Promise<{ message: string }> {
    const revokedPermission = await this.revokedPermissionRepository.findOne({
        where: { user: { id: userId }, permission: { key: permissionKey } },
    });

    if (revokedPermission) {
        await this.revokedPermissionRepository.remove(revokedPermission);
    }
    
    return { message: 'Permission revocation removed successfully.' };
  }


  // =================================================================================
  // --- SYNCHRONIZATION FUNCTIONS ---
  // These functions set the user's permissions to an exact state.
  // =================================================================================

  /**
   * Synchronizes a user's direct permissions.
   * Ensures the user has exactly the permissions in the provided list,
   * adding any that are missing and removing any that are not in the list.
   * This is the ideal function for a UI with a list of checkboxes.
   * @param userId The user's ID.
   * @param permissionKeys The complete list of permission keys the user should have directly.
   * @returns The final list of the user's direct permissions.
   */
  async syncDirectUserPermissions(userId: string, permissionKeys: string[]): Promise<UserDirectPermissionEntity[]> {
    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');

    const allValidPermissions = await this.permissionRepository.findBy({ key: In(permissionKeys) });
    if (allValidPermissions.length !== permissionKeys.length) {
      throw new NotFoundException('One or more provided permission keys are invalid.');
    }

    const currentDirectPermissions = await this.directPermissionRepository.find({
      where: { user: { id: userId } },
      relations: ['permission'],
    });

    const currentKeys = currentDirectPermissions.map(p => p.permission.key);
    const newKeys = permissionKeys;

    const keysToAdd = newKeys.filter(key => !currentKeys.includes(key));
    const permissionsToRemove = currentDirectPermissions.filter(p => !newKeys.includes(p.permission.key));

    // 1. Remove permissions that are no longer needed.
    if (permissionsToRemove.length > 0) {
      await this.directPermissionRepository.remove(permissionsToRemove);
    }

    // 2. Business Rule: Ensure any new grants override revocations.
    if (keysToAdd.length > 0) {
        await this.revokedPermissionRepository.delete({
            user: { id: userId },
            permission: { key: In(keysToAdd) }
        });
    }
    // 3. Add the new permissions.
    const permissionsToAdd = allValidPermissions.filter(p => keysToAdd.includes(p.key));
    const newAssignments = permissionsToAdd.map(permission => 
      this.directPermissionRepository.create({ user, permission })
    );

    if (newAssignments.length > 0) {
      await this.directPermissionRepository.save(newAssignments);
    }

    return this.directPermissionRepository.find({ where: { user: { id: userId } } });
  }

  /**
   * Synchronizes a user's revoked permissions.
   * Ensures the user has exactly the permissions in the provided list revoked.
   * @param userId The user's ID.
   * @param permissionKeys The complete list of permission keys to revoke.
   */
  async syncRevokedUserPermissions(userId: string, permissionKeys: string[]): Promise<RevokedPermissionEntity[]> {
    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');

    const allValidPermissions = await this.permissionRepository.findBy({ key: In(permissionKeys) });
    if (allValidPermissions.length !== permissionKeys.length) {
      throw new NotFoundException('One or more provided permission keys are invalid.');
    }

    const currentRevokedPermissions = await this.revokedPermissionRepository.find({
      where: { user: { id: userId } },
      relations: ['permission'],
    });
    
    const currentKeys = currentRevokedPermissions.map(p => p.permission.key);
    const newKeys = permissionKeys;

    const keysToRevoke = newKeys.filter(key => !currentKeys.includes(key));
    const revocationsToRemove = currentRevokedPermissions.filter(p => !newKeys.includes(p.permission.key));

    // 1. Remove revocations that are no longer needed.
    if (revocationsToRemove.length > 0) {
      await this.revokedPermissionRepository.remove(revocationsToRemove);
    }
    
    // 2. Business Rule: Ensure new revocations override direct grants.
    if (keysToRevoke.length > 0) {
        await this.directPermissionRepository.delete({
            user: { id: userId },
            permission: { key: In(keysToRevoke) }
        });
    }

    // 3. Add the new revocations.
    const permissionsToRevoke = allValidPermissions.filter(p => keysToRevoke.includes(p.key));
    const newRevocations = permissionsToRevoke.map(permission => 
      this.revokedPermissionRepository.create({ user, permission })
    );

    if (newRevocations.length > 0) {
      await this.revokedPermissionRepository.save(newRevocations);
    }

    return this.revokedPermissionRepository.find({ where: { user: { id: userId } } });
  }

   // =================================================================================
  // --- BULK ADDITIVE FUNCTIONS ---
  // These functions add multiple permissions without removing existing ones.
  // =================================================================================

  /**
   * Directly assigns multiple permissions to a user.
   * This is an additive operation and will not remove existing direct permissions.
   */
  async assignMultiplePermissionsToUser(userId: string, permissionKeys: string[]): Promise<UserDirectPermissionEntity[]> {
    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');

    const permissions = await this.permissionRepository.findBy({ key: In(permissionKeys) });
    if (permissions.length !== permissionKeys.length) {
        throw new NotFoundException('One or more permission keys were not found.');
    }
    
    // Remove revocations for the permissions we are about to grant.
    await this.revokedPermissionRepository.delete({ user: { id: userId }, permission: { key: In(permissionKeys) } });
    
    // Prevent creating duplicates.
    const existingDirect = await this.directPermissionRepository.find({ where: { user: { id: userId }, permission: { key: In(permissionKeys) } } });
    const existingKeys = existingDirect.map(p => p.permission.key);
    const permissionsToCreate = permissions.filter(p => !existingKeys.includes(p.key));

    const newAssignments = permissionsToCreate.map(permission => this.directPermissionRepository.create({ user, permission }));

    return this.directPermissionRepository.save(newAssignments);
  }

  /**
   * Revokes multiple permissions from a user.
   * This is an additive operation and will not remove existing revocations.
   */
  async revokeMultiplePermissionsFromUser(userId: string, permissionKeys: string[]): Promise<RevokedPermissionEntity[]> {
    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');
    
    const permissions = await this.permissionRepository.findBy({ key: In(permissionKeys) });
    if (permissions.length !== permissionKeys.length) {
        throw new NotFoundException('One or more permission keys were not found.');
    }
    
    // Remove direct grants for the permissions we are about to revoke.
    await this.directPermissionRepository.delete({ user: { id: userId }, permission: { key: In(permissionKeys) } });
    
    // Prevent creating duplicates.
    const existingRevoked = await this.revokedPermissionRepository.find({ where: { user: { id: userId }, permission: { key: In(permissionKeys) } } });
    const existingKeys = existingRevoked.map(p => p.permission.key);
    const permissionsToRevoke = permissions.filter(p => !existingKeys.includes(p.key));
    
    const newRevocations = permissionsToRevoke.map(permission => this.revokedPermissionRepository.create({ user, permission }));

    return this.revokedPermissionRepository.save(newRevocations);
  }

  // --- NEW CORE METHOD FOR QUERY BUILDING ---
  /**
   * Applies access control WHERE clauses to a QueryBuilder instance based on a config.
   *
   * @param qb The SelectQueryBuilder instance to modify.
   * @param userId The ID of the user whose permissions should be applied.
   * @param config A mapping of scope types to the column names on the target entity.
   */
  async applyPermissionScope<T extends ObjectLiteral>(
    qb: SelectQueryBuilder<T>,
    userId: string,
    config: ScopeFilteringConfig,
  ): Promise<SelectQueryBuilder<T>> {
    const scopes = await this.getUserPermissionScopes(userId);

    // Super-admins can see everything.
    if (scopes.hasGlobalScope) {
      return qb;
    }

    // If the user has no relevant scopes, they can see nothing.
    const hasNoScopes =
      scopes.universityIds.length === 0 &&
      scopes.institutionIds.length === 0 &&
      scopes.departmentIds.length === 0;

    if (hasNoScopes) {
      return qb.andWhere('1=0'); // No access
    }

    // Dynamically build the WHERE clause based on the provided config.
    qb.andWhere(
      new Brackets((subQuery) => {
        let hasAppliedCondition = false;
        const addCondition = (condition: string, params?: object) => {
            if (hasAppliedCondition) subQuery.orWhere(condition, params);
            else subQuery.where(condition, params);
            hasAppliedCondition = true;
        };

        // 1. Direct scope matches (University, Institution, Department)
        if (config.university && scopes.universityIds.length > 0) {
          addCondition(`${qb.alias}.${config.university} IN (:...universityIds)`, { universityIds: scopes.universityIds });
        }
        if (config.institution && scopes.institutionIds.length > 0) {
          addCondition(`${qb.alias}.${config.institution} IN (:...institutionIds)`, { institutionIds: scopes.institutionIds });
        }
        if (config.department && scopes.departmentIds.length > 0) {
          addCondition(`${qb.alias}.${config.department} IN (:...departmentIds)`, { departmentIds: scopes.departmentIds });
        }
        
        // 2. *** HIERARCHICAL SCOPE MATCH ***
        // If the user has a University scope, also grant them access to items
        // within that university's departments.
        if (config.department && scopes.universityIds.length > 0) {
            addCondition(`${qb.alias}.${config.department} IN (
                SELECT id FROM departments WHERE "universityId" IN (:...universityIds)
            )`, { universityIds: scopes.universityIds });
        }

        // If no relevant scopes matched the config, the user shouldn't see anything.
        if (!hasAppliedCondition) {
            subQuery.where('1=0');
        }
      }),
    );

    return qb;
  }

}