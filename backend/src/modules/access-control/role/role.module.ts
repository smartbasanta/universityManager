import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RoleService } from './role.service';
import { RoleController } from './role.controller';
import { RoleEntity } from 'src/model/role.entity';
import { PermissionEntity } from 'src/model/permission.entity';
import { AuthEntity } from 'src/model/auth.entity';
import { UserRoleAssignmentEntity } from 'src/model/user_role_assignment.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { DepartmentEntity } from 'src/model/department.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RoleEntity,
      PermissionEntity,
      AuthEntity,
      UserRoleAssignmentEntity,
      UniversityEntity,
      InstitutionEntity,
      DepartmentEntity,
    ]),
  ],
  controllers: [RoleController],
  providers: [RoleService],
  exports: [RoleService],
})
export class RoleModule {}