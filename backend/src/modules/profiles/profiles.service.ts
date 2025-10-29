import { Injectable, NotFoundException, ConflictException, InternalServerErrorException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { AuthEntity } from 'src/model/auth.entity';
import { StudentEntity } from 'src/model/student.entity';
import { StaffEntity } from 'src/model/staff.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { AuthService } from '../auth/auth.service';
import { UserType } from 'src/helper/enums/user-type.enum';
import { CreateStudentProfileDto, CreateStaffProfileDto, CreateMentorProfileDto, UpdateUserStatusDto, UpdatePersonStatusDto, UpdateStudentProfileDto } from './dto/profiles.dto';
import { UniversityEntity } from 'src/model/university.entity';
import { ProgramEntity } from 'src/model/program.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { PermissionService, ScopeFilteringConfig } from '../access-control/permission/permission.service';
import { PersonStatus, UserStatus } from 'src/helper/enums/user-status.enum';

@Injectable()
export class ProfilesService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly authService: AuthService,
    @InjectRepository(AuthEntity) private readonly authRepo: Repository<AuthEntity>,
    @InjectRepository(StudentEntity) private readonly studentRepo: Repository<StudentEntity>,
    @InjectRepository(StaffEntity) private readonly staffRepo: Repository<StaffEntity>,
    @InjectRepository(MentorInResidenceEntity) private readonly mentorRepo: Repository<MentorInResidenceEntity>,
    private readonly permissionService: PermissionService,
  ) {}

  private async getAuthUserAndCheckForProfile(manager: EntityManager, authId: string): Promise<AuthEntity> {
    const authUser = await manager.findOneBy(AuthEntity, { id: authId });
    if (!authUser) throw new NotFoundException('Authenticated user not found.');
    if (authUser.userType) throw new ConflictException('This user already has a profile.');
    return authUser;
  }

  // --- PROFILE CREATION METHODS ---

  async createStudentProfile(dto: CreateStudentProfileDto, authId: string): Promise<StudentEntity> {
    return this.dataSource.transaction(async manager => {
        try {
            const authUser = await this.getAuthUserAndCheckForProfile(manager, authId);
            const university = await manager.findOneByOrFail(UniversityEntity, { id: dto.universityId });
            const program = await manager.findOneByOrFail(ProgramEntity, { id: dto.programId });

            const newStudent = manager.create(StudentEntity, { ...dto, auth: authUser, university, program });
            const savedStudent = await manager.save(newStudent);

            await this.authService.assignDefaultRole(authId, UserType.STUDENT, { universityId: university.id });
            
            return savedStudent;
        } catch (err) {
            throw new InternalServerErrorException(`Failed to create student profile: ${err.message}`);
        }
    });
  }

  async createStaffProfile(dto: CreateStaffProfileDto, authId: string): Promise<StaffEntity> {
    return this.dataSource.transaction(async manager => {
        try {
            const authUser = await this.getAuthUserAndCheckForProfile(manager, authId);
            const university = await manager.findOneByOrFail(UniversityEntity, { id: dto.universityId });
            const department = dto.departmentId ? await manager.findOneByOrFail(DepartmentEntity, { id: dto.departmentId }) : null;

            const newStaff = manager.create(StaffEntity, { ...dto, auth: authUser, university, department });
            const savedStaff = await manager.save(newStaff);

            await this.authService.assignDefaultRole(authId, UserType.STAFF, {
                universityId: university.id,
                departmentId: department?.id,
            });
            
            return savedStaff;
        } catch (err) {
            throw new InternalServerErrorException(`Failed to create staff profile: ${err.message}`);
        }
    });
  }

  async createMentorProfile(dto: CreateMentorProfileDto, authId: string): Promise<MentorInResidenceEntity> {
    return this.dataSource.transaction(async manager => {
        try {
            const authUser = await this.getAuthUserAndCheckForProfile(manager, authId);
            const university = await manager.findOneByOrFail(UniversityEntity, { id: dto.universityId });
            
            const newMentor = manager.create(MentorInResidenceEntity, { ...dto, auth: authUser, university });
            const savedMentor = await manager.save(newMentor);

            await this.authService.assignDefaultRole(authId, UserType.MENTOR_IN_RESIDENCE, { universityId: university.id });
            
            return savedMentor;
        } catch (err) {
            throw new InternalServerErrorException(`Failed to create mentor profile: ${err.message}`);
        }
    });
  }
  
  // --- PROFILE UPDATE & MANAGEMENT ---

  async updateOwnStudentProfile(dto: UpdateStudentProfileDto, authId: string): Promise<StudentEntity> {
      const profile = await this.studentRepo.findOneBy({ auth: { id: authId } });
      if (!profile) throw new NotFoundException('Student profile not found.');
      
      const updatedProfile = this.studentRepo.merge(profile, dto);
      return this.studentRepo.save(updatedProfile);
  }

  async updateUserStatus(profileId: string, dto: UpdateUserStatusDto | UpdatePersonStatusDto): Promise<any> {
      // First, try to find a Staff or Ambassador
      let profile = await this.staffRepo.findOneBy({ id: profileId });
      if (profile && 'status' in dto) {
          profile.status = dto.status as UserStatus;
          return this.staffRepo.save(profile);
      }

      // If not, try to find a Mentor
      let mentorProfile = await this.mentorRepo.findOneBy({ id: profileId });
      if (mentorProfile && 'status' in dto) {
          mentorProfile.status = dto.status as PersonStatus;
          return this.mentorRepo.save(mentorProfile);
      }

      throw new NotFoundException(`User profile with ID "${profileId}" not found or status type is mismatched.`);
  }

  async findFullProfileByAuthId(authId: string): Promise<any> {
    const authUser = await this.authRepo.findOne({
        where: { id: authId },
        relations: [
            'student', 'student.university', 'student.program',
            'staff', 'staff.university', 'staff.department',
            'mentor_in_residence', 'mentor_in_residence.university',
            'student_ambassador', 'student_ambassador.university'
        ],
    });
    if (!authUser) throw new NotFoundException('User not found.');

    return authUser.student || authUser.staff || authUser.mentor_in_residence || authUser.student_ambassador || null;
  }

  async findAllStaff(user: AuthEntity): Promise<StaffEntity[]> {
    const qb = this.staffRepo.createQueryBuilder('staff');
    
    const scopeConfig: ScopeFilteringConfig = {
      university: 'universityId',
      institution: 'institutionId',
      department: 'departmentId',
    };
    
    await this.permissionService.applyPermissionScope(qb, user.id, scopeConfig);
    
    return qb.getMany();
  }

  async findAllStudents(user: AuthEntity): Promise<StudentEntity[]> {
    const qb = this.studentRepo.createQueryBuilder('student');
    
    // A student is primarily scoped to a university
    const scopeConfig: ScopeFilteringConfig = {
      university: 'universityId',
    };
    
    await this.permissionService.applyPermissionScope(qb, user.id, scopeConfig);
    
    // Example of joining related entities
    return qb.leftJoinAndSelect('student.program', 'program').getMany();
  }

  async findAllMentors(user: AuthEntity): Promise<MentorInResidenceEntity[]> {
    const qb = this.mentorRepo.createQueryBuilder('mentor');

    const scopeConfig: ScopeFilteringConfig = {
        university: 'universityId',
        department: 'departmentId',
    };

    await this.permissionService.applyPermissionScope(qb, user.id, scopeConfig);
    
    return qb.getMany();
  }
}