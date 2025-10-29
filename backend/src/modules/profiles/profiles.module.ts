import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { AuthEntity } from 'src/model/auth.entity';
import { StudentEntity } from 'src/model/student.entity';
import { StaffEntity } from 'src/model/staff.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { ProgramEntity } from 'src/model/program.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { AuthModule } from '../auth/auth.module';
import { PermissionModule } from '../access-control/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthEntity,
      StudentEntity,
      StaffEntity,
      MentorInResidenceEntity,
      StudentAmbassadorEntity,
      UniversityEntity,
      ProgramEntity,
      DepartmentEntity,
    ]),
    forwardRef(() => AuthModule), // Use forwardRef here as well
    PermissionModule // For future permission guards
  ],
  controllers: [ProfilesController],
  providers: [ProfilesService],
})
export class ProfilesModule {}