import { Module, forwardRef } from '@nestjs/common'; // Import forwardRef
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Token } from 'src/helper/utils/token';
import { hash } from 'src/helper/utils/hash';
import { AtStrategy } from 'src/middlewares/access_token/at.strategy';
import { RtStrategy } from 'src/middlewares/refresh_token/rt.strategy';
import { JwtService } from '@nestjs/jwt';
import { UtStrategy } from 'src/middlewares/utils_token/ut.strategy';
import { ConfigService } from '@nestjs/config';

import { UploadService } from 'src/helper/utils/files_upload';

import { AuthEntity } from 'src/model/auth.entity';
import { UserRoleAssignmentEntity } from 'src/model/user_role_assignment.entity';

import { UniversityEntity } from 'src/model/university.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { StudentEntity } from 'src/model/student.entity';
import { StaffEntity } from 'src/model/staff.entity';
import { PermissionEntity } from 'src/model/permission.entity';
import { RoleEntity } from 'src/model/role.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { DepartmentEntity } from 'src/model/department.entity';

import { UniversityModule } from '../university/university.module';
import { ProfilesModule } from '../profiles/profiles.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthEntity,
      StaffEntity,
      PermissionEntity,
      RoleEntity,
      UserRoleAssignmentEntity,
      StudentEntity,
      StudentAmbassadorEntity,
      MentorInResidenceEntity,
      UniversityEntity,
      InstitutionEntity,
      DepartmentEntity,
    ]),
    forwardRef(() => UniversityModule),
    forwardRef(() => ProfilesModule),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    Token,
    hash,
    AtStrategy,
    RtStrategy,
    UtStrategy,
    JwtService,
    ConfigService,
    UploadService,
  ],
  exports: [AuthService],
})
export class AuthModule {}
