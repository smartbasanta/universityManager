import {
  Controller,
  Post,
  Body,
  Patch,
  UseGuards,
  Req,
  FileTypeValidator,
  ParseFilePipe,
  UploadedFile,
  BadRequestException,
  UseInterceptors,
  Get,
  Query,
  ParseUUIDPipe,
  Param
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto, MailDto, passwordDto } from './dto/create-auth.dto';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { RtGuard } from 'src/middlewares/refresh_token/rt.guard';
import { UtGuard } from 'src/middlewares/utils_token/ut.guard';
import { AtGuard } from 'src/middlewares/access_token/at.guard';

import { UpdatePasswordDto } from './dto/update-auth.dto';

import { UploadService } from 'src/helper/utils/files_upload';
import { UniversityService } from '../university/university.service'; // Import other services
import { StudentService } from '../student/student.service';

import { FileInterceptor } from '@nestjs/platform-express';
import { profilePhotoStorage } from 'src/config/multer.config';

@Controller('auth')
@ApiTags('Auth')
@ApiResponse({ status: 201, description: 'Created Successfully' })
@ApiResponse({ status: 401, description: 'Unathorised request' })
@ApiResponse({ status: 400, description: 'Bad request' })
@ApiResponse({ status: 500, description: 'Server Error' })
export class AuthController {
  constructor(
    private readonly authService: AuthService,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Register a new user account' })
  register(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.register(createAuthDto);
  }

  @Post('signin')
  @ApiOperation({ summary: 'Signin to your Account' })
  login(@Body() createAuthDto: CreateAuthDto) {
    return this.authService.login(createAuthDto);
  }

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify email using a token from the verification link' })
  @ApiQuery({ name: 'token', type: String, description: 'The verification token sent to the user\'s email.' })
  verifyEmail(@Query('token') token: string) {
    if (!token) {
      throw new BadRequestException('Verification token is required.');
    }
    return this.authService.verifyEmail(token);
  }

  //get email for verification
  @Post('resend-verification')
  @ApiOperation({ summary: 'Request an email verification link for a new account' })
  getVerify(@Body() mail: MailDto) {
    return this.authService.resendVerificationEmail(mail);
  }

  @Post('refresh-token')
  @UseGuards(RtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Generate a new access token using a refresh token' })
  refreshToken(@Req() req: any) {
    return this.authService.refreshToken(req.user);
  }

  @Get('me')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Get profile summary for the currently logged-in user' })
  userInfo(@Req() req: any) {
    return this.authService.getCombinedUserInfo(req.user);
  }

  @Patch('update-password')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update password for a logged-in user' })
  updatePassword(@Req() req: any, @Body() passwordDto: UpdatePasswordDto) {
    return this.authService.updatePassword(req.user.sub, passwordDto);
  }

  @Post('forget-password')
  @ApiOperation({ summary: 'Request a password reset link' })
  forgetPassword(@Body() body: MailDto) {
    return this.authService.sendPasswordResetEmail(body);
  }

  @Patch('reset-password')
  @UseGuards(UtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Set a new password using a reset token' })
  resetPassword(@Req() req: any, @Body() passwordDto: passwordDto) {
    return this.authService.resetPassword(req.user.sub, passwordDto);
  }


  // //register University account
  // @Post('register-university')
  // @UseGuards(UtGuard)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'create your University Account' })
  // async create(
  //   @Body() createUniversitydto: CreateUniversityDto,
  //   @Req() req: any,
  // ) {
  //   const jwtPayload = req.user;
  //   return this.universityService.createUniversity(createUniversitydto, jwtPayload);
  // }

  // //register student account
  // @Post('register-student')
  // @UseGuards(UtGuard)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'create your student Account' })
  // // @ApiConsumes('multipart/form-data')
  // // @UseInterceptors(FileInterceptor('photo'))
  // async createStudent(
  //   @Body() createStudentdto: CreateStudentDto,
  //   @Req() req: any,
  //   // @UploadedFile(
  //   //   new ParseFilePipe({
  //   //     fileIsRequired: false,
  //   //     validators: [
  //   //       // new MaxFileSizeValidator({ maxSize: 1000 }),
  //   //       new FileTypeValidator({ fileType: /image\/(jpeg|png|jpg|webp)/ }),
  //   //     ],
  //   //   }),
  //   // )
  //   // file?: Express.Multer.File,
  // ) {
  //   // if (file) {
  //   //   const s3response = await this.uploadService.upload(file);
  //   //   createStudentdto.photo = s3response;
  //   // } else {
  //   //   throw new BadRequestException("No photo uploaded!");
  //   // }
  //   const jwtPayload = req.user;
  //   return this.studentService.createStudent(createStudentdto, jwtPayload);
  // }

  // //register company account
  // @Post('register-institution')
  // @UseGuards(UtGuard)
  // @ApiBearerAuth('access-token')
  // @ApiOperation({ summary: 'create your Institution Account' })
  // async createCompany(
  //   @Body() createCompanydto: createInstitutionDto,
  //   @Req() req: any,
  // ) {
  //   const jwtPayload = req.user;
  //   console.log(jwtPayload);

  //   return this.institutionService.createInstitution(createCompanydto, jwtPayload);
  // }

  // @Get('google')
  // @ApiOperation({ summary: 'redirect to Google for authentication' })
  // @UseGuards(AuthGuard('google'))
  // async googleAuth() {
  //   // This will redirect to Google for authentication
  // }

  // @Get('google/callback')
  // @ApiOperation({ summary: 'get user details from Google' })
  // @UseGuards(AuthGuard('google'))
  // async googleAuthRedirect(@Req() req) {
  //   const auth = req.user;
  //   return this.authService.GoogleOauth(auth);
  // }
  // // @Post('staff-signin')
  // // @ApiOperation({ summary: 'SignIn your Account' })
  // // loginStaff(@Body() createAuthDto: CreateAuthDto) {
  // //   return this.authService.loginStaff(createAuthDto)
  // // }

  @Patch('update-profile-photo')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update the profile photo for the logged-in user' })
  @UseInterceptors(FileInterceptor('file', profilePhotoStorage))
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  updateProfilePhoto(
    @Req() req: any,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const { sub, role } = req.user;
    if (!file) {
      throw new BadRequestException('No file uploaded!');
    }
    const photoUrl = `https://my-cdn.com/photos/${file.filename}`;
    return this.authService.updateProfilePhoto(req.user.sub, photoUrl);
    // return this.authService.updateProfilePhoto(sub, role, file.path);
  }
}
