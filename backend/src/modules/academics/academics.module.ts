
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AcademicsService } from './academics.service';
import { AcademicsController } from './academics.controller';
import { DepartmentEntity } from 'src/model/department.entity';
import { ProgramEntity } from 'src/model/program.entity';
import { CourseEntity } from 'src/model/course.entity';
import { FacultyEntity } from 'src/model/faculty.entity';
import { UniversityEntity } from 'src/model/university.entity';

import { PermissionModule } from '../access-control/permission/permission.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([
      DepartmentEntity, ProgramEntity, CourseEntity, FacultyEntity, UniversityEntity
    ]),
    PermissionModule,
  ],
  controllers: [AcademicsController],
  providers: [AcademicsService],
})
export class AcademicsModule {}