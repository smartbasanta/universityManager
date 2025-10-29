import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { RoleEntity } from 'src/model/role.entity';
import { PermissionEntity } from 'src/model/permission.entity';
import { AuthEntity } from 'src/model/auth.entity';
import { UserRoleAssignmentEntity } from 'src/model/user_role_assignment.entity';
import { PermissionScope } from '../permission/permission.service';
import { UniversityEntity } from 'src/model/university.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { DepartmentEntity } from 'src/model/department.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(UserRoleAssignmentEntity)
    private readonly assignmentRepository: Repository<UserRoleAssignmentEntity>,
    @InjectRepository(UniversityEntity)
    private readonly universityRepository: Repository<UniversityEntity>,
    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,
    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,
  ) {}

  async findAll(): Promise<RoleEntity[]> {
    return this.roleRepository.find();
  }

  //we also need a function that assigns one role without replacing previously assigned permissions
  /**
   * Replaces all permissions for a given role with a new set.
   * This handles both assigning and resetting permissions.
   */
  async updateRolePermissions(roleKey: string, permissionKeys: string[]): Promise<RoleEntity> {
    const role = await this.roleRepository.findOneBy({ key: roleKey });
    if (!role) throw new NotFoundException(`Role with key "${roleKey}" not found.`);

    // Handle wildcard permission
    if (permissionKeys.includes('*')) {
        const allPermissions = await this.permissionRepository.find();
        role.permissions = allPermissions;
    } else {
        const permissions = await this.permissionRepository.findBy({
            key: In(permissionKeys),
        });
        if (permissions.length !== permissionKeys.length) {
            throw new NotFoundException('One or more permission keys were not found.');
        }
        role.permissions = permissions;
    }

    return this.roleRepository.save(role);
  }

  //here we need two functions bulk role assignment and bulk role remover
  
  /**
   * Assigns a role to a user within a specific scope.
   */
  async assignRoleToUser(
    userId: string,
    roleKey: string,
    scope: PermissionScope = {},
    expiresAt: Date | null = null,
  ): Promise<UserRoleAssignmentEntity> {
    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');

    const role = await this.roleRepository.findOneBy({ key: roleKey });
    if (!role) throw new NotFoundException(`Role with key "${roleKey}" not found.`);
    
    const assignment = this.assignmentRepository.create({ user, role, expiresAt });

    // Attach the correct scope entity based on the provided IDs
    if (scope.universityId) {
        assignment.universityScope = await this.universityRepository.findOneByOrFail({ id: scope.universityId });
    } else if (scope.institutionId) {
        assignment.institutionScope = await this.institutionRepository.findOneByOrFail({ id: scope.institutionId });
    } else if (scope.departmentId) {
        assignment.departmentScope = await this.departmentRepository.findOneByOrFail({ id: scope.departmentId });
    }

    return this.assignmentRepository.save(assignment);
  }

  /**
   * Removes a specific role assignment from a user.
   */
  async removeRoleFromUser(assignmentId: string): Promise<{ message: string }> {
      const result = await this.assignmentRepository.delete(assignmentId);
      if (result.affected === 0) {
          throw new NotFoundException(`Role assignment with ID "${assignmentId}" not found.`);
      }
      return { message: 'Role assignment removed successfully.' };
  }

   // =================================================================================
  // --- SYNCHRONIZATION FUNCTION ---
  // =================================================================================

  /**
   * Synchronizes a user's role assignments to an exact state.
   * This is the ideal method for a UI where an admin manages a user's complete role list.
   * It adds missing assignments and removes any that are not in the provided list.
   */
  async syncUserRoles(
    userId: string,
    desiredAssignments: { roleKey: string; scope: PermissionScope }[],
  ): Promise<UserRoleAssignmentEntity[]> {
    const user = await this.authRepository.findOne({
      where: { id: userId },
      relations: ['roleAssignments', 'roleAssignments.role', 'roleAssignments.universityScope', 'roleAssignments.institutionScope', 'roleAssignments.departmentScope']
    });
    if (!user) throw new NotFoundException('User not found.');

    const currentAssignments = user.roleAssignments;

    // Helper to create a unique string identifier for an assignment
    const getAssignmentId = (roleKey: string, scope: PermissionScope): string => {
      if (scope.universityId) return `${roleKey}_university_${scope.universityId}`;
      if (scope.institutionId) return `${roleKey}_institution_${scope.institutionId}`;
      if (scope.departmentId) return `${roleKey}_department_${scope.departmentId}`;
      return `${roleKey}_global`; // For roles with no scope
    };

    const desiredIds = new Set(desiredAssignments.map(a => getAssignmentId(a.roleKey, a.scope)));
    const currentIds = new Set(currentAssignments.map(a => getAssignmentId(a.role.key, {
        universityId: a.universityScope?.id,
        institutionId: a.institutionScope?.id,
        departmentId: a.departmentScope?.id,
    })));

    // 1. Determine which assignments to remove
    const assignmentsToRemove = currentAssignments.filter(a => !desiredIds.has(getAssignmentId(a.role.key, {
        universityId: a.universityScope?.id,
        institutionId: a.institutionScope?.id,
        departmentId: a.departmentScope?.id,
    })));

    // 2. Determine which assignments to add
    const assignmentsToAddPayload = desiredAssignments.filter(a => !currentIds.has(getAssignmentId(a.roleKey, a.scope)));

    // 3. Perform database operations
    if (assignmentsToRemove.length > 0) {
      await this.assignmentRepository.remove(assignmentsToRemove);
    }

    for (const payload of assignmentsToAddPayload) {
      // This re-uses your existing single-assignment logic, which is efficient and DRY
      await this.assignRoleToUser(userId, payload.roleKey, payload.scope);
    }
    
    // Return the final, complete list of assignments for the user
    return this.assignmentRepository.find({ where: { user: { id: userId } } });
  }

  // =================================================================================
  // --- BULK ADDITIVE & REMOVAL FUNCTIONS ---
  // =================================================================================
  
  /**
   * Assigns multiple roles to a user under a single, shared scope.
   * This is an additive operation.
   */
  async assignMultipleRolesToUser(userId: string, roleKeys: string[], scope: PermissionScope): Promise<UserRoleAssignmentEntity[]> {
    const user = await this.authRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found.');

    const roles = await this.roleRepository.findBy({ key: In(roleKeys) });
    if (roles.length !== roleKeys.length) throw new NotFoundException('One or more roles not found.');

    const newAssignments: Partial<UserRoleAssignmentEntity>[] = [];
    for (const role of roles) {
      const assignment: Partial<UserRoleAssignmentEntity> = { user, role };
      if (scope.universityId) assignment.universityScope = await this.universityRepository.findOneByOrFail({ id: scope.universityId });
      else if (scope.institutionId) assignment.institutionScope = await this.institutionRepository.findOneByOrFail({ id: scope.institutionId });
      else if (scope.departmentId) assignment.departmentScope = await this.departmentRepository.findOneByOrFail({ id: scope.departmentId });
      newAssignments.push(assignment);
    }

    // Note: This simple version doesn't check for duplicates. The sync function is better for exact states.
    const createdAssignments = this.assignmentRepository.create(newAssignments);
    return this.assignmentRepository.save(createdAssignments);
  }

  /**
   * Removes multiple role assignments from users based on their unique IDs.
   */
  async removeMultipleRolesFromUser(assignmentIds: string[]): Promise<{ message: string; deletedCount: number | null | undefined }> {
    if (assignmentIds.length === 0) {
      throw new BadRequestException('Assignment IDs array cannot be empty.');
    }
    const result = await this.assignmentRepository.delete(assignmentIds);
    if (result.affected === 0) {
      throw new NotFoundException('None of the provided role assignments were found.');
    }
    return { message: 'Role assignments removed successfully.', deletedCount: result.affected };
  }
}