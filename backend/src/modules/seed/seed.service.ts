import { Injectable, Logger, OnModuleInit } from '@nestjs/common'; // <-- Import OnModuleInit
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import * as argon from 'argon2';

// --- DATA ---
import { permissionsData } from './data/permissions.data';
import { rolesData } from './data/roles.data';
import { countriesData } from './data/countries.data';


import { NewsStatus } from 'src/helper/types/index.type';
import { UserStatus } from 'src/helper/enums/user-status.enum';
import { UserType } from 'src/helper/enums/user-type.enum';


// --- ENTITIES ---
import { PermissionEntity } from 'src/model/permission.entity';
import { RoleEntity } from 'src/model/role.entity';
import { AuthEntity } from 'src/model/auth.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { StaffEntity } from 'src/model/staff.entity';
import { StudentEntity } from 'src/model/student.entity';
import { FacultyEntity } from 'src/model/faculty.entity';
import { ProgramEntity, ProgramLevel } from 'src/model/program.entity';
import { CourseEntity } from 'src/model/course.entity';
import { UserRoleAssignmentEntity } from 'src/model/user_role_assignment.entity';
import { JobEntity, EmploymentType, ExperienceLevel, ModeOfWork, JobStatus } from 'src/model/job.entity';
import { ScholarshipEntity } from 'src/model/scholarship.entity';
import { ResearchNewsEntity } from 'src/model/research_news.entity';

import { UniversityOverviewEntity } from 'src/model/university_overview.entity';
import { UniversityRankingEntity } from 'src/model/university_ranking.entity';
import { UniversitySportsEntity } from 'src/model/university_sports.entity';
import { AdmissionLevel, UniversityAdmissionEntity } from 'src/model/university_admission.entity';
import { RequirementType, UniversityAdmissionRequirementEntity } from 'src/model/university_admission_requirement.entity';
import { UniversityStudentLifeEntity } from 'src/model/university_student_life.entity';
import { ResidencyType, UniversityTuitionEntity } from 'src/model/university_tuition.entity';
import { UniversityTraditionEntity } from 'src/model/university_tradition.entity';
import { BookingEntity } from 'src/model/booking.entity';
import { CareerOutcomesEntity } from 'src/model/career_outcomes.entity';
import { CommentEntity } from 'src/model/comment.entity';
import { EntrepreneurshipEntity } from 'src/model/entrepreneurship.entity';
import { HackathonEntity } from 'src/model/hackathon.entity';
import { HostedEventEntity } from 'src/model/hosted_event.entity';
import { HousingEntity } from 'src/model/housing.entity';
import { IncubatorEntity } from 'src/model/incubator.entity';
import { JobAnswerEntity } from 'src/model/job_answer.entity';
import { JobQuestionEntity, JobQuestionType } from 'src/model/job_question.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { NotableAlumniEntity } from 'src/model/notable_alumni.entity';
import { OpportunityEntity, OpportunityLocation, OpportunityScope, OpportunityStatus, OpportunityType } from 'src/model/opportunity.entity';
import { OpportunityQuestionEntity } from 'src/model/opportunity_question.entity';
import { OpportunityTeamMemberQuestionEntity } from 'src/model/opportunity_team_member_questions.entity';
import { ProgramOutcomeEntity } from 'src/model/program_outcome.entity';
import { ResearchHubEntity } from 'src/model/research_hub.entity';
import { ReviewEntity } from 'src/model/review.entity';
import { RoomOptionEntity } from 'src/model/room_option.entity';
import { ScholarshipQuestionEntity } from 'src/model/scholarship_question.entity';
import { ScholarshipAnswerEntity } from 'src/model/scholarship_answer.entity';
import { SlotEntity } from 'src/model/slot.entity';
import { SportsFacilityEntity } from 'src/model/sports_facility.entity';
import { SportsTeamEntity } from 'src/model/sports_team.entity';
import { StartupStoryEntity } from 'src/model/startup_story.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { StudentOpportunityAnswerEntity } from 'src/model/student_opportunity_answer.entity';
import { StudentOrganizationEntity } from 'src/model/student_organization.entity';
import { TeamAchievementEntity } from 'src/model/team_achievement.entity';
import { TopEmployerEntity } from 'src/model/top_employer.entity';
import { CountryEntity } from 'src/model/country.entity';



// --- CONSTANTS FOR SEEDING ---
const NUM_UNIVERSITIES = 2;
const NUM_INSTITUTIONS = 3;
const NUM_DEPARTMENTS_PER_UNI = 2;
const NUM_STAFF_PER_UNI = 3;
const NUM_STUDENTS_PER_UNI = 10;
@Injectable()
export class SeedService implements OnModuleInit {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(PermissionEntity) private readonly permissionRepository: Repository<PermissionEntity>,
    @InjectRepository(RoleEntity) private readonly roleRepository: Repository<RoleEntity>,
    @InjectRepository(AuthEntity) private readonly authRepository: Repository<AuthEntity>,
    @InjectRepository(UniversityEntity) private readonly universityRepository: Repository<UniversityEntity>,
    @InjectRepository(DepartmentEntity) private readonly departmentRepository: Repository<DepartmentEntity>,
    @InjectRepository(InstitutionEntity) private readonly institutionRepository: Repository<InstitutionEntity>,
    @InjectRepository(StaffEntity) private readonly staffRepository: Repository<StaffEntity>,
    @InjectRepository(StudentEntity) private readonly studentRepository: Repository<StudentEntity>,
    @InjectRepository(FacultyEntity) private readonly facultyRepository: Repository<FacultyEntity>,
    @InjectRepository(ProgramEntity) private readonly programRepository: Repository<ProgramEntity>,
    @InjectRepository(CourseEntity) private readonly courseRepository: Repository<CourseEntity>,
    @InjectRepository(UserRoleAssignmentEntity) private readonly roleAssignmentRepository: Repository<UserRoleAssignmentEntity>,
    @InjectRepository(JobEntity) private readonly jobRepository: Repository<JobEntity>,
    @InjectRepository(ScholarshipEntity) private readonly scholarshipRepository: Repository<ScholarshipEntity>,
    @InjectRepository(ResearchNewsEntity) private readonly newsRepository: Repository<ResearchNewsEntity>,

    @InjectRepository(CountryEntity) private readonly countryRepository: Repository<CountryEntity>,
    @InjectRepository(UniversityOverviewEntity) private readonly overviewRepository: Repository<UniversityOverviewEntity>,
    @InjectRepository(UniversityAdmissionEntity) private readonly admissionRepository: Repository<UniversityAdmissionEntity>,
    @InjectRepository(UniversityAdmissionRequirementEntity) private readonly admissionReqRepository: Repository<UniversityAdmissionRequirementEntity>,
    @InjectRepository(UniversityTuitionEntity) private readonly tuitionRepository: Repository<UniversityTuitionEntity>,
    @InjectRepository(UniversityRankingEntity) private readonly rankingRepository: Repository<UniversityRankingEntity>,
    @InjectRepository(UniversityStudentLifeEntity) private readonly studentLifeRepository: Repository<UniversityStudentLifeEntity>,
    @InjectRepository(UniversitySportsEntity) private readonly sportsRepository: Repository<UniversitySportsEntity>,
    @InjectRepository(ReviewEntity) private readonly reviewRepository: Repository<ReviewEntity>,
    @InjectRepository(NotableAlumniEntity) private readonly alumniRepository: Repository<NotableAlumniEntity>,
 

    private readonly dataSource: DataSource,
  ) {}

  /**
   * This method is now the automatic trigger for seeding on application startup.
   */
  async onModuleInit() {
    // --- IMPORTANT: ADD A CHECK TO PREVENT RE-SEEDING ---
    // This is crucial for development. Without this, the seed would run
    // every time you save a file and the server restarts.
    if (process.env.NODE_ENV === 'production') {
        this.logger.log('Seeding is disabled in production environment.');
        return;
    }

    const permissionCount = await this.permissionRepository.count();
    if (permissionCount > 0) {
        this.logger.log('Database has already been seeded. Skipping.');
        return;
    }
    
    // Call the main seeding method
    await this.seed();
  }

  
  async seed() {
    this.logger.log('--- Starting Database Seeding ---');

    // STEP 1: Seed foundational data (no dependencies)
    const permissions = await this.seedPermissions();
    const countries = await this.seedCountries();
    const roles = await this.seedRoles(await this.permissionRepository.find());

    // STEP 2: Seed core user types and their profiles
    await this.seedSuperAdmin(roles['SUPER_ADMIN']);
    const institutions = await this.seedInstitutions(NUM_INSTITUTIONS, roles['INSTITUTION_ADMIN'], countries);
    const universities = await this.seedUniversities(NUM_UNIVERSITIES, roles['UNIVERSITY_ADMIN'], countries);

    // STEP 3: For each university, seed its entire rich ecosystem
    for (const university of universities) {
        this.logger.log(`--- Seeding rich ecosystem for ${university.university_name} ---`);
        await this.seedUniversityEcosystem(university, roles, institutions);
    }
    

    this.logger.log('--- Database Seeding Finished Successfully ---');
  }

  // =================================================================================
  // ECOSYSTEM SEEDER (Orchestrator for a single university)
  // =================================================================================
  private async seedUniversityEcosystem(university: UniversityEntity, roles: { [key: string]: RoleEntity }, institutions: InstitutionEntity[]) {
    // Academic Structure
    const departments = await this.seedDepartments(university, NUM_DEPARTMENTS_PER_UNI, roles['DEPARTMENT_ADMIN']);
    const programs = await this.seedAcademics(departments);

    // People
    const staff = await this.seedStaff(university, NUM_STAFF_PER_UNI, roles['STAFF'], departments);
    const students = await this.seedStudents(university, NUM_STUDENTS_PER_UNI, roles['STUDENT'], programs);

    // University Profile Content (Rankings, Alumni, etc.)
    await this.seedUniversityProfileContent(university, students);
    
    // User-Generated Content (Jobs, News, etc.)
    await this.seedScopedContent(university, institutions, departments, staff);
  }

  // =================================================================================
  // FOUNDATIONAL SEEDERS
  // =================================================================================
  private async seedCountries(): Promise<CountryEntity[]> {
    if (await this.countryRepository.count() > 0) return this.countryRepository.find();
    this.logger.log('Seeding Countries...');
    return this.countryRepository.save(this.countryRepository.create(countriesData));
  }

  // =================================================================================
  // PERMISSION AND ROLE SEEDERS
  // =================================================================================

  private async seedPermissions(): Promise<PermissionEntity[]> {
    if (await this.permissionRepository.count() > 0) return this.permissionRepository.find();
    this.logger.log('Seeding Permissions...');
    const permissions = this.permissionRepository.create(permissionsData);
    return this.permissionRepository.save(permissions);
  }

  private async seedRoles(permissions: PermissionEntity[]): Promise<{ [key: string]: RoleEntity }> {
    if (await this.roleRepository.count() > 0) {
      const rolesArray = await this.roleRepository.find({ relations: ['permissions'] });
      return rolesArray.reduce((acc, role) => ({ ...acc, [role.key]: role }), {});
    }
    this.logger.log('Seeding Roles...');
    const permissionMap = permissions.reduce((acc, p) => ({ ...acc, [p.key]: p }), {});
    const rolesToCreate = rolesData.map(roleInfo => {
      const rolePermissions = roleInfo.permissions[0] === '*'
        ? permissions
        : roleInfo.permissions.map(key => permissionMap[key]).filter(p => p);
      return this.roleRepository.create({ ...roleInfo, permissions: rolePermissions });
    });
    const savedRoles = await this.roleRepository.save(rolesToCreate);
    return savedRoles.reduce((acc, role) => ({ ...acc, [role.key]: role }), {});
  }

  // =================================================================================
  // USER AND PROFILE SEEDERS
  // =================================================================================

  private async createAuthRecord(email: string): Promise<AuthEntity> {
    const existingUser = await this.authRepository.findOneBy({ email });
    if (existingUser) return existingUser;
    
    const hashedPassword = await argon.hash('password123');
    const auth = this.authRepository.create({
      email,
      password: hashedPassword,
      isVerified: true,
      lastLoginAt: new Date(),
    });
    return this.authRepository.save(auth);
  }
  /**
   * [NEW & IMPROVED]
   * Central function to create a user, their specific profile, assign roles, and set the userType.
   */
  private async seedUserWithProfile(
    profileData: { name: string; email: string },
    userType: UserType,
    role: RoleEntity,
    profileCreationFn: (auth: AuthEntity) => Promise<any>, // Function to create the specific profile
    scope: { university?: UniversityEntity; institution?: InstitutionEntity; department?: DepartmentEntity } = {},
  ): Promise<AuthEntity> {
    
    // 1. Create the base authentication record
    const auth = await this.createAuthRecord(profileData.email);

    // 2. If the user already has a type, they've been seeded. Skip.
    if (auth.userType) return auth;

    // 3. Create the specific profile (Student, Staff, etc.)
    await profileCreationFn(auth);

    // 4. Assign the role with the correct scope
    await this.assignRole(auth, role, scope);

    // 5. *** THIS IS THE CRITICAL FIX ***
    // Update the AuthEntity with the correct userType.
    await this.authRepository.update(auth.id, { userType: userType });
    auth.userType = userType; // Update the in-memory object as well

    return auth;
  }
  
  private async seedSuperAdmin(role: RoleEntity) {
      this.logger.log('Seeding Super Admin...');
      const email = 'superadmin@example.com';
      const auth = await this.createAuthRecord(email);
      if (auth.userType) return; // Already created

      // Super admin is a special case: they have an Auth record but no specific profile entity.
      await this.assignRole(auth, role); // Global scope
      await this.authRepository.update(auth.id, { userType: UserType.STAFF }); // Assign a generic type
  }

  private async seedUniversities(count: number, adminRole: RoleEntity, countries: CountryEntity[]): Promise<UniversityEntity[]> {
    if (await this.universityRepository.count() > 0) return this.universityRepository.find({ relations: ['auth']});
    this.logger.log(`Seeding ${count} Universities...`);
    
    const universities: UniversityEntity[] = [];
    for (let i = 0; i < count; i++) {
        const companyName = faker.company.name();
        const universityName = `${companyName} University`;
        
        const createUniversityProfile = async (auth: AuthEntity) => {
            const country = faker.helpers.arrayElement(countries.filter(c => c.name === 'United States' || c.name === 'United Kingdom'));
            const overview = await this.overviewRepository.save(this.overviewRepository.create({
                university_type: faker.helpers.arrayElement(['Public', 'Private']),
                campus_setting: faker.helpers.arrayElement(['Urban', 'Suburban', 'Rural']),
                country: country.name,
                state: faker.location.state(),
                city: faker.location.city(),
                student_faculty_ratio: `${faker.number.int({min: 10, max: 25})}:1`,
                endowment: parseInt(faker.finance.amount({ min: 100000000, max: 5000000000, dec: 0 })),
            }));

            const university = this.universityRepository.create({
                university_name: universityName,
                banner: faker.image.urlLoremFlickr({ category: 'architecture' }),
                logo: faker.image.avatar(),
                about: faker.lorem.paragraphs(2),
                website: faker.internet.url(),
                status: 'active',
                is_published: true,
                auth: auth,
                overview: overview,
                // Create empty relations to be filled later
                student_life: await this.dataSource.getRepository(UniversityStudentLifeEntity).save({}),
                sports: await this.dataSource.getRepository(UniversitySportsEntity).save({}),
            });
            const savedUniversity = await this.universityRepository.save(university);
            universities.push(savedUniversity);
            await this.assignRole(auth, adminRole, { university: savedUniversity });
        };
        
        await this.seedUserWithProfile(
            { name: `${companyName} Admin`, email: `uniadmin${i}@example.com` },
            UserType.UNIVERSITY_ADMIN,
            adminRole,
            createUniversityProfile
        );
    }
    return this.universityRepository.find({ where: { id: In(universities.map(u => u.id)) }, relations: ['auth'] });
  }
  
  private async seedInstitutions(count: number, adminRole: RoleEntity, countries: CountryEntity[]): Promise<InstitutionEntity[]> {
    if (await this.institutionRepository.count() > 0) return this.institutionRepository.find({ relations: ['auth']});
    this.logger.log(`Seeding ${count} Institutions...`);

    const institutions: InstitutionEntity[] = [];
    for (let i = 0; i < count; i++) {
        const companyName = faker.company.name();
        const createInstitutionProfile = async (auth: AuthEntity) => {
            const institution = this.institutionRepository.create({
                name: companyName, logo: faker.image.avatar(), website: faker.internet.url(),
                industry: faker.commerce.department(), auth,
                country: faker.helpers.arrayElement(countries).name,
            });
            const savedInstitution = await this.institutionRepository.save(institution);
            institutions.push(savedInstitution);
            await this.assignRole(auth, adminRole, { institution: savedInstitution });
        };
        await this.seedUserWithProfile(
            { name: `${companyName} HR`, email: `instadmin${i}@example.com` },
            UserType.INSTITUTION_ADMIN, adminRole, createInstitutionProfile
        );
    }
    return this.institutionRepository.find({ where: { id: In(institutions.map(i => i.id)) }, relations: ['auth'] });
  }

  private async seedDepartments(university: UniversityEntity, count: number, adminRole: RoleEntity): Promise<DepartmentEntity[]> {
    this.logger.log(`Seeding ${count} departments for ${university.university_name}...`);
    const departments: DepartmentEntity[] = [];
    for (let i = 0; i < count; i++) {
        const deptName = faker.commerce.department() + ' Department';

        const createDepartmentProfile = async (auth: AuthEntity) => {
            const department = this.departmentRepository.create({
                name: deptName,
                description: faker.lorem.sentence(),
                university: university,
                auth: auth,
            });
            const savedDept = await this.departmentRepository.save(department);
            departments.push(savedDept);
            await this.assignRole(auth, adminRole, { department: savedDept });
        };

        await this.seedUserWithProfile(
            { name: `${deptName} Head`, email: `deptadmin_${university.id.substring(0,4)}_${i}@example.com` },
            UserType.DEPARTMENT_ADMIN,
            adminRole,
            createDepartmentProfile
        );
    }
    return departments;
  }

  private async seedStaff(university: UniversityEntity, count: number, staffRole: RoleEntity, departments: DepartmentEntity[]): Promise<StaffEntity[]> {
    this.logger.log(`Seeding ${count} staff for ${university.university_name}...`);
    const staffMembers: StaffEntity[] = []; // 1. Create an array to hold the results

    for (let i = 0; i < count; i++) {
        const name = faker.person.fullName();
        const department = faker.helpers.arrayElement(departments);

        // 2. The profile creation function now needs to be async to await the save
        const createStaffProfile = async (auth: AuthEntity) => {
            const staff = await this.staffRepository.save(
                this.staffRepository.create({
                    name, job_title: faker.person.jobTitle(), status: UserStatus.ACTIVE,
                    auth, university, department,
                })
            );
            staffMembers.push(staff); // 3. Add the saved entity to the array
        };
        
        await this.seedUserWithProfile(
            { name, email: `staff_${university.id.substring(0,4)}_${i}@example.com` },
            UserType.STAFF, staffRole, createStaffProfile, { university, department }
        );
    }
    return staffMembers; // 4. Return the completed array
  }

  private async seedStudents(university: UniversityEntity, count: number, studentRole: RoleEntity, programs: ProgramEntity[]): Promise<StudentEntity[]> {
      this.logger.log(`Seeding ${count} students for ${university.university_name}...`);
      const students: StudentEntity[] = []; // 1. Create an array

      for (let i = 0; i < count; i++) {
          const name = faker.person.fullName();
          const program = faker.helpers.arrayElement(programs);

          // 2. Make the function async
          const createStudentProfile = async (auth: AuthEntity) => {
              const student = await this.studentRepository.save(
                  this.studentRepository.create({
                      name, enrollmentYear: faker.number.int({ min: 2020, max: 2024 }),
                      auth, university, program,
                  })
              );
              students.push(student); // 3. Add to the array
          };
          
          await this.seedUserWithProfile(
              { name, email: `student_${university.id.substring(0,4)}_${i}@example.com` },
              UserType.STUDENT, studentRole, createStudentProfile, { university }
          );
      }
      return students; // 4. Return the array
  }

  private async seedAcademics(departments: DepartmentEntity[]): Promise<ProgramEntity[]> {
    this.logger.log(`Seeding academics for ${departments.length} departments...`);
    const allPrograms: ProgramEntity[] = [];
    for(const department of departments) {
        const faculty = await this.facultyRepository.save(this.facultyRepository.create({
            name: `Dr. ${faker.person.lastName()}`,
            title: 'Professor',
            department,
        }));
        const program = await this.programRepository.save(this.programRepository.create({
            name: `B.S. in ${faker.word.noun()}`,
            level: ProgramLevel.UNDERGRADUATE,
            department,
        }));
        await this.courseRepository.save(this.courseRepository.create({
            course_code: `${faker.lorem.word().substring(0,2).toUpperCase()}${faker.number.int({min: 100, max: 499})}`,
            title: `Introduction to ${faker.word.words(2)}`,
            credits: 3,
            program,
            instructor: faculty,
        }));
        allPrograms.push(program);
    }
    return allPrograms;
  }



  // =================================================================================
  // ROLE ASSIGNMENT AND CONTENT SEEDERS
  // =================================================================================

  private async assignRole(user: AuthEntity, role: RoleEntity, scope: { university?: UniversityEntity; institution?: InstitutionEntity; department?: DepartmentEntity; } = {}) {
    const assignment = this.roleAssignmentRepository.create({
      user,
      role,
      universityScope: scope.university,
      institutionScope: scope.institution,
      departmentScope: scope.department,
    });
    await this.roleAssignmentRepository.save(assignment);
  }
  
  // =================================================================================
  // NEW: RICH CONTENT SEEDERS
  // =================================================================================
  private async seedUniversityProfileContent(university: UniversityEntity, students: StudentEntity[]) {
    this.logger.log(`Seeding profile content for ${university.university_name}...`);

    // --- Seed Admissions ---
    const admission = await this.admissionRepository.save(this.admissionRepository.create({
        level: AdmissionLevel.UNDERGRADUATE,
        acceptance_rate: faker.number.int({ min: 20, max: 80 }),
        application_deadline: faker.date.future(),
        university,
    }));
    await this.admissionReqRepository.save([
        { name: 'SAT Score', type: RequirementType.TEST_SCORE, percentile_25: '1350', percentile_75: '1550', admission, is_required: true },
        { name: 'High School GPA', type: RequirementType.GPA, percentile_25: '3.8', percentile_75: '4.0', admission, is_required: true },
        { name: 'Personal Essay', type: RequirementType.ESSAY, admission, is_required: true },
    ]);
    const tuitionsToCreate = [
        { 
            university, 
            level: ProgramLevel.UNDERGRADUATE, 
            residency: ResidencyType.IN_STATE, 
            academic_year: 2024, 
            tuition_and_fees: parseFloat(faker.finance.amount({min: 10000, max: 25000, dec: 2})),
            // Add other optional fields to make the data richer
            books_and_supplies_cost: parseFloat(faker.finance.amount({min: 800, max: 1500, dec: 2})),
            housing_cost: parseFloat(faker.finance.amount({min: 12000, max: 18000, dec: 2})),
            meal_plan_cost: parseFloat(faker.finance.amount({min: 4000, max: 7000, dec: 2})),
        },
        { 
            university, 
            level: ProgramLevel.UNDERGRADUATE, 
            residency: ResidencyType.OUT_OF_STATE, 
            academic_year: 2024, 
            tuition_and_fees: parseFloat(faker.finance.amount({min: 35000, max: 60000, dec: 2})),
            books_and_supplies_cost: parseFloat(faker.finance.amount({min: 800, max: 1500, dec: 2})),
            housing_cost: parseFloat(faker.finance.amount({min: 12000, max: 18000, dec: 2})),
            meal_plan_cost: parseFloat(faker.finance.amount({min: 4000, max: 7000, dec: 2})),
        },
    ];
    const tuitionEntities = this.tuitionRepository.create(tuitionsToCreate);
        await this.tuitionRepository.save(tuitionEntities);

    await this.rankingRepository.save([
        { university, source: 'U.S. News & World Report', year: 2024, subject: 'National Universities', rank: `T-${faker.number.int({min:10, max: 50})}` },
        { university, source: 'Times Higher Education', year: 2024, subject: 'World University Rankings', rank: `${faker.number.int({min:51, max: 200})}` },
    ]);
    
    // --- Seed Reviews ---
    const reviewsToCreate = faker.helpers.arrayElements(students, 3).map(student => {
        return this.reviewRepository.create({
            rating: faker.number.int({ min: 3, max: 5 }),
            comment: faker.lorem.paragraph(),
            student,
            author: student,
            university,
        });
    });
    await this.reviewRepository.save(reviewsToCreate);
    
    // --- Seed Notable Alumni ---
    await this.dataSource.getRepository(NotableAlumniEntity).save(
        this.dataSource.getRepository(NotableAlumniEntity).create({
            name: faker.person.fullName(),
            graduation_year: faker.number.int({ min: 1980, max: 2010 }),
            notable_field: faker.person.jobArea(),
            accomplishments: faker.lorem.sentence(),
            university,
        })
    );
  }

  private async seedScopedContent(university: UniversityEntity, institutions: InstitutionEntity[], departments: DepartmentEntity[], staff: StaffEntity[]) {
      this.logger.log(`Seeding scoped content for ${university.university_name}...`);
      const randomStaffAuth = faker.helpers.arrayElement(staff).auth;

      // Seed a Job
      await this.jobRepository.save(this.jobRepository.create({
          title: `Software Engineer at ${faker.company.name()}`,
          description: faker.lorem.paragraph(), location: faker.location.city(),
          employmentType: EmploymentType.FULL_TIME, experienceLevel: ExperienceLevel.MID,
          modeOfWork: ModeOfWork.HYBRID, status: JobStatus.LIVE,
          institution: faker.helpers.arrayElement(institutions),
          department: faker.helpers.arrayElement(departments),
          auth: randomStaffAuth,
      }));

      // Seed a Scholarship
      await this.scholarshipRepository.save(this.scholarshipRepository.create({
          name: `Women in STEM Scholarship`,
          description: 'Encouraging diversity in technology.',
          amount: 5000, deadline: faker.date.future(),
          university, auth: university.auth,
      }));

      // Seed a News Article
       await this.newsRepository.save(this.newsRepository.create({
          title: `Breakthrough in ${faker.word.adjective()} ${faker.word.noun()} Research`,
          abstract: faker.lorem.sentence(), article: faker.lorem.paragraphs(5),
          category: 'Science', status: NewsStatus.PUBLISHED,
          university, auth: randomStaffAuth,
      }));
  }
}