import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { Token } from 'src/helper/utils/token';
import { hash } from 'src/helper/utils/hash';
import {
  JwtPayload,
  VerifyPayload,
} from 'src/helper/types/index.type';

import { sendMail } from 'src/config/mail.config';
import { CreateUniversityDto } from '../university/dto/create-university.dto';
import { CreateStudentDto } from '../student/dto/create-student.dto';
import { CreateAuthDto, MailDto, passwordDto } from './dto/create-auth.dto';

import { AuthEntity } from 'src/model/auth.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { InstitutionEntity } from 'src/model/institution.entity';
import { DepartmentEntity } from 'src/model/department.entity';
import { StudentEntity } from 'src/model/student.entity';
import { StaffEntity } from 'src/model/staff.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';

import { PermissionEntity } from 'src/model/permission.entity';
import { RoleEntity } from 'src/model/role.entity';
import { UserRoleAssignmentEntity } from 'src/model/user_role_assignment.entity';
import { PermissionScope } from '../access-control/permission/permission.service';

import { UserType } from 'src/helper/enums/user-type.enum';
import { ConfigService } from '@nestjs/config';
import { UpdatePasswordDto } from './dto/update-auth.dto';


@Injectable()
export class AuthService {
  constructor(

    @InjectRepository(AuthEntity)
    private readonly authRepository: Repository<AuthEntity>,

    @InjectRepository(RoleEntity)
    private readonly roleRepository: Repository<RoleEntity>,

    @InjectRepository(UserRoleAssignmentEntity)
    private readonly assignmentRepository: Repository<UserRoleAssignmentEntity>,

    
    @InjectRepository(PermissionEntity)
    private readonly permissionRepository: Repository<PermissionEntity>,
    
    
    @InjectRepository(UniversityEntity)
    private readonly universityRepository: Repository<UniversityEntity>,
    
    @InjectRepository(InstitutionEntity)
    private readonly institutionRepository: Repository<InstitutionEntity>,

    @InjectRepository(DepartmentEntity)
    private readonly departmentRepository: Repository<DepartmentEntity>,

    @InjectRepository(StudentEntity)
    private readonly studentRepository: Repository<StudentEntity>,
    
    @InjectRepository(StaffEntity)
    private readonly staffRepository: Repository<StaffEntity>,

    @InjectRepository(StudentAmbassadorEntity)
    private readonly studentAmbassadorRepository: Repository<StudentAmbassadorEntity>,

    @InjectRepository(MentorInResidenceEntity)
    private readonly mentorInResidenceRepository: Repository<MentorInResidenceEntity>,


    private token: Token,
    private hash: hash,
    private readonly dataSource: DataSource,
    private config: ConfigService,
  ) {}

  /**
   * Handles the initial user registration. Creates an unverified AuthEntity.
   */
  async register(createAuthDto: CreateAuthDto): Promise<{ message: string }> {
    const { email, password } = createAuthDto;

    const existingUser = await this.authRepository.findOneBy({ email });
    if (existingUser) {
      throw new ConflictException('An account with this email already exists.');
    }

    const hashedPassword = await this.hash.value(password);

    const newUser = this.authRepository.create({
      email,
      password: hashedPassword,
      isVerified: false, // Starts as unverified
      userType: null, // No type assigned yet
    });

    await this.authRepository.save(newUser);

    // Send verification email
    // await this.sendVerificationEmail({ email });
    await this._sendVerificationLink(email);

    return {
      message:
        'Registration successful. Please check your email to verify your account.',
    };
  }

  /**
   * Verifies a user's email via a token and marks their account as verified.
   */
  async verifyEmail(token: string): Promise<{ accessToken: string }> {
    try {
      // Use the new verify method with the correct secret key
      const payload: VerifyPayload = await this.token.verify<VerifyPayload>(
        token,
        this.config.get<string>('JWT_VERIFY_SECRET'),
      );
      const user = await this.authRepository.findOneBy({ email: payload.email });

      if (!user) {
        throw new NotFoundException('User to verify not found.');
      }
      if (user.isVerified) {
        throw new BadRequestException('Email is already verified.');
      }

      await this.authRepository.update(user.id, { isVerified: true });

      // Return a new utility token that grants access to create a profile (e.g., student, university)
      return {
        accessToken: await this.token.generateUtilToken({ sub: user.id }),
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired verification token.');
    }
  }


  /**
   * Assigns the default role to a newly created user profile.
   * This should be called by other services (e.g., StudentService) after they create a profile.
   */
  async assignDefaultRole(
    authId: string,
    userType: UserType,
    scope?: { universityId?: string; departmentId?: string; institutionId?: string; },
  ): Promise<void> {
    const authUser = await this.authRepository.findOneBy({ id: authId });
    if (!authUser) throw new NotFoundException('Auth user not found for role assignment.');

    // Find the default role for the given user type (e.g., 'STUDENT')
    const defaultRole = await this.roleRepository.findOneBy({ key: userType.toUpperCase(), isDefault: true });
    if (!defaultRole) {
        console.warn(`No default role found for key: ${userType.toUpperCase()}`);
        // Fallback to the simplest role if no default is marked
        const fallbackRole = await this.roleRepository.findOneBy({ key: userType.toUpperCase() });
        if (!fallbackRole) throw new NotFoundException(`Role with key ${userType.toUpperCase()} not found.`);
        
        const assignment = this.assignmentRepository.create({
            user: authUser,
            role: fallbackRole,
            // ... apply scope if provided
        });
        await this.assignmentRepository.save(assignment);
    } else {
        const assignment = this.assignmentRepository.create({
            user: authUser,
            role: defaultRole,
            // ... apply scope if provided
        });
        await this.assignmentRepository.save(assignment);
    }
    // Finally, update the userType on the AuthEntity itself for easy lookups
    await this.authRepository.update(authId, { userType });
  }

  async login(createAuthDto: CreateAuthDto) {
    const { email, password } = createAuthDto;
    const authUser = await this.authRepository.findOne({
      where: { email },
      select: ['id', 'password'], // Only select necessary fields
    });

    if (!authUser) {
      throw new ForbiddenException('The provided email does not match any registered user.');
    }

    const passwordMatches = await this.hash.verifyHashing(authUser.password, password);
    if (!passwordMatches) {
      throw new UnauthorizedException('The password entered is incorrect.');
    }

    const tokens = {
      accessToken: await this.token.generateAcessToken({ sub: authUser.id }),
      refreshToken: await this.token.generateRefreshToken({ sub: authUser.id }),
    };

    const hashedRToken = await this.hash.value(tokens.refreshToken);
    await this.authRepository.update(authUser.id, { rToken: hashedRToken });

    return tokens;
  }

  async refreshToken(user: JwtPayload) {
    return await this.token.generateAcessToken({
      sub: user.sub,
    });
  }

  async resendVerificationEmail(mail: MailDto): Promise<{ message: string }> {
    const { email } = mail;
    const user = await this.authRepository.findOneBy({ email });

    if (!user) {
      // We don't want to reveal if an email is registered or not for security reasons
      return { message: 'If an account with that email exists, a verification link has been sent.' };
    }

    if (user.isVerified) {
      throw new BadRequestException('This account has already been verified.');
    }

    await this._sendVerificationLink(email);

    return { message: 'A new verification email has been sent. Please check your inbox.' };
  }
  /**
   * Private helper to avoid duplicating email sending logic.
   */
  private async _sendVerificationLink(email: string): Promise<void> {
    const token = await this.token.generateVerifyToken({ email });
    
    // This URL should point to your frontend application, which will then call the backend API.
    const verificationUrl = `${process.env.FRONT_URL}/verify-email?token=${token}`;
    
    sendMail(
      email,
      'Verify Your Email for Research Shock',
      this.emailTemplate(verificationUrl),
    );
  }

  async sendPasswordResetEmail(mail: MailDto): Promise<{ message: string }> {
    const { email } = mail;
    const existingUser = await this.authRepository.findOneBy({ email });
    if (!existingUser) {
      throw new NotFoundException('No account found with this email address.');
    }

    const token = await this.token.generateUtilToken({ sub: existingUser.id });
    const frontURL = `${process.env.FRONT_URL}/reset-password?token=${token}`;
    sendMail(email, 'Reset Your Password for Research Shock', this.passwordTemplate(frontURL));

    return { message: 'Password reset link sent successfully. Please check your inbox.' };
  }

  async resetPassword(id: string, passwordDto: passwordDto) {
    try {
      const { password } = passwordDto;
      const hash = await this.hash.value(password);
      const user = await this.authRepository.findOne({ where: { id } });
      if (!user) {
        throw new BadRequestException("User does'nt exist");
      }
      //need changes like sending the reset email and than changing the password from there
      user.password = hash;
      return await this.authRepository.save(user);
    } catch (e) {}
  }

  async updatePassword(userId: string, passwordDto: UpdatePasswordDto): Promise<{ message: string }> {
    const user = await this.authRepository.findOne({ where: { id: userId }, select: ['id', 'password'] });
    if (!user) {
      throw new NotFoundException("User not found.");
    }

    const { oldPassword, newPassword } = passwordDto;
    if (!(await this.hash.verifyHashing(user.password, oldPassword))) {
      throw new UnauthorizedException('The old password entered is incorrect.');
    }

    const hashedPassword = await this.hash.value(newPassword);
    await this.authRepository.update(userId, { password: hashedPassword });
    return { message: 'Password updated successfully.' };
  }

  async getCombinedUserInfo(user: JwtPayload) {
    const authData = await this.authRepository.findOne({
      where: { id: user.sub },
      relations: [
        'university', // For university owner profile
        'staff',      // For staff profile
        'student',    // For student profile
        'student_ambassador',
        'mentor_in_residence',
        'department',
        'institute',
      ],
    });

    if (!authData) throw new NotFoundException('User not found');

    if (authData.university) return { type: 'University', name: authData.university.university_name, photo: authData.university.logo };
    if (authData.staff) return { type: 'Staff', name: authData.staff.name, photo: authData.staff.photo, title: authData.staff.job_title };
    if (authData.student) return { type: 'Student', name: authData.student.name, photo: authData.student.photo };
    if (authData.student_ambassador) return { type: 'StudentAmbassador', name: authData.student_ambassador.name, photo: authData.student_ambassador.photo };
    if (authData.mentor_in_residence) return { type: 'Mentor', name: authData.mentor_in_residence.name, photo: authData.mentor_in_residence.photo };
    if (authData.institute) return { type: 'Institution', name: authData.institute.name, photo: authData.institute.logo };
    if (authData.department) return { type: 'Department', name: authData.department.name, description: authData.department.description };

    return { type: 'Unknown', name: 'N/A', photo: null };
  }

  async updateProfilePhoto(userId: string, photoUrl: string): Promise<{ message: string }> {
    const authUser = await this.authRepository.findOne({
      where: { id: userId },
      relations: ['staff', 'student', 'student_ambassador', 'mentor_in_residence'],
    });
    if (!authUser) throw new NotFoundException('User not found.');

    if (authUser.staff) {
      await this.staffRepository.update(authUser.staff.id, { photo: photoUrl });
    } else if (authUser.student) {
      await this.studentRepository.update(authUser.student.id, { photo: photoUrl });
    } else if (authUser.student_ambassador) {
      await this.studentAmbassadorRepository.update(authUser.student_ambassador.id, { photo: photoUrl });
    } else if (authUser.mentor_in_residence) {
      await this.mentorInResidenceRepository.update(authUser.mentor_in_residence.id, { photo: photoUrl });
    } else {
      throw new BadRequestException('This user profile does not support a profile photo.');
    }
    return { message: 'Profile photo updated successfully.' };
  }



  // Other methods like refreshToken, register, etc., remain largely the same logically,
  // but should be cleaned up to remove the old `role` column logic.
  // For example, in createUniversity:
  // auth.role = roleType.UNIVERSITY; // THIS LINE IS DELETED
  // Instead, after saving the university, you would create a UserRoleAssignmentEntity

  private passwordTemplate(resetUrl: string) {
    return `
      <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Reset Your Password</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #fff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          h1 {
              color: #333;
              margin-bottom: 20px;
          }
          p {
              font-size: 16px;
              color: #555;
              margin-bottom: 30px;
          }
          .button {
              display: inline-block;
              width: 80%;
              padding: 12px;
              background-color: #007BFF;
              color: white;
              text-align: center;
              border-radius: 5px;
              font-size: 16px;
              text-decoration: none;
              cursor: pointer;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #0056b3;
          }
          .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Password Reset Request</h1>
          <p>Hello, User</p>
          <p>You've requested to reset your password for your Research Shock account. Click the link below to set a new password:</p>
          <a href="${resetUrl}" class="button" style="color: white; text-decoration: none;">Reset My Password</a>
          <p>If you didn't request this, please ignore this email.</p>
          <p class="footer">© 2025 Research Shock. All rights reserved.</p>
      </div>
  </body>
  </html>
    `;
  }

  private emailTemplate(verifyUrl: string) {
    return `
      <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
          body {
              font-family: Arial, sans-serif;
              background-color: #f4f4f4;
              margin: 0;
              padding: 20px;
          }
          .container {
              max-width: 500px;
              margin: 0 auto;
              background-color: #fff;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
              text-align: center;
          }
          h1 {
              color: #333;
              margin-bottom: 20px;
          }
          p {
              font-size: 16px;
              color: #555;
              margin-bottom: 30px;
          }
          .button {
              display: inline-block;
              width: 80%;
              padding: 12px;
              background-color: #007BFF;
              color: white;
              text-align: center;
              border-radius: 5px;
              font-size: 16px;
              text-decoration: none;
              cursor: pointer;
              transition: background-color 0.3s;
          }
          .button:hover {
              background-color: #0056b3;
          }
          .footer {
              margin-top: 20px;
              font-size: 14px;
              color: #777;
          }
      </style>
  </head>
  <body>
      <div class="container">
          <h1>Verify your email</h1>
          <p>Hello, User</p>
          <p>You've requested to verify your email for your Research Shock account. Click the link below to verify the email:</p>
          <a href="${verifyUrl}" class="button" style="color: white; text-decoration: none;">Verify my email </a>
          <p>If you didn't request this, please ignore this email.</p>
          <p class="footer">© 2025 Research Shock. All rights reserved.</p>
      </div>
  </body>
  </html>
    `;
  }
}
