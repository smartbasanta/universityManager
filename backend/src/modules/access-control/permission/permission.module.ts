import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionService } from './permission.service';
import { PermissionController } from './permission.controller';
import { AuthEntity } from 'src/model/auth.entity';
import { PermissionEntity } from 'src/model/permission.entity';
import { UserDirectPermissionEntity } from 'src/model/user_direct_permission.entity';
import { RevokedPermissionEntity } from 'src/model/revoked_permission.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { UniversityEntity } from 'src/model/university.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthEntity,
      PermissionEntity,
      UserDirectPermissionEntity,
      RevokedPermissionEntity,
      DepartmentEntity,
      InstitutionEntity,
      UniversityEntity,
    ]),
  ],
  controllers: [PermissionController],
  providers: [PermissionService],
  exports: [PermissionService], // Export so other modules (like Guards) can use it
})
export class PermissionModule {}