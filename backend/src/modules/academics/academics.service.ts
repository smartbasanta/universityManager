import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DepartmentEntity } from 'src/model/department.entity';
import { ProgramEntity } from 'src/model/program.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { CreateDepartmentDto, CreateProgramDto } from './dto/academics.dto';
import { PermissionService, ScopeFilteringConfig } from '../access-control/permission/permission.service';
import { AuthEntity } from 'src/model/auth.entity';

@Injectable()
export class AcademicsService {
  constructor(
    @InjectRepository(DepartmentEntity) private readonly departmentRepo: Repository<DepartmentEntity>,
    @InjectRepository(ProgramEntity) private readonly programRepo: Repository<ProgramEntity>,
    @InjectRepository(UniversityEntity) private readonly universityRepo: Repository<UniversityEntity>,
    private readonly permissionService: PermissionService,
  ) {}

  async createDepartment(dto: CreateDepartmentDto): Promise<DepartmentEntity> {
    const university = await this.universityRepo.findOneBy({ id: dto.universityId });
    if (!university) throw new NotFoundException('University not found.');
    const department = this.departmentRepo.create({ ...dto, university });
    return this.departmentRepo.save(department);
  }

  async createProgram(dto: CreateProgramDto): Promise<ProgramEntity> {
    const department = await this.departmentRepo.findOneBy({ id: dto.departmentId });
    if (!department) throw new NotFoundException('Department not found.');
    const program = this.programRepo.create({ ...dto, department });
    return this.programRepo.save(program);
  }

  async findDepartmentsByUniversity(universityId: string): Promise<DepartmentEntity[]> {
      return this.departmentRepo.find({ where: { university: { id: universityId } }, relations: ['programs'] });
  }

  /**
   * Finds all departments accessible to the user based on their scope.
   */
  async findAllDepartments(user: AuthEntity): Promise<DepartmentEntity[]> {
    const qb = this.departmentRepo.createQueryBuilder('department');

    // The entity is a department.
    // A university scope applies to its 'universityId' FK.
    // A department scope applies to its own 'id'.
    const scopeConfig: ScopeFilteringConfig = {
      university: 'universityId',
      department: 'id',
    };
    
    await this.permissionService.applyPermissionScope(qb, user.id, scopeConfig);
    
    return qb.getMany();
  }
}