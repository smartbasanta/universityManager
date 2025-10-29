import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req, Put } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { UtGuard } from 'src/middlewares/utils_token/ut.guard';
import { ProfilesService } from './profiles.service';
import { CreateStudentProfileDto, CreateStaffProfileDto, CreateMentorProfileDto, UpdateUserStatusDto, UpdatePersonStatusDto, UpdateStudentProfileDto } from './dto/profiles.dto';

@ApiTags('User Profiles')
@ApiBearerAuth('access-token')
@Controller('profiles')
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  // --- Profile Creation Endpoints (Requires Utility Token from Email Verification) ---
  @Post('student')
  @UseGuards(UtGuard)
  @ApiOperation({ summary: 'Create a student profile for the authenticated user' })
  createStudentProfile(@Body() dto: CreateStudentProfileDto, @Req() req: any) {
    return this.profilesService.createStudentProfile(dto, req.user.sub);
  }

  @Post('staff')
  @UseGuards(UtGuard)
  @ApiOperation({ summary: 'Create a staff profile for the authenticated user' })
  createStaffProfile(@Body() dto: CreateStaffProfileDto, @Req() req: any) {
    return this.profilesService.createStaffProfile(dto, req.user.sub);
  }

  @Post('mentor')
  @UseGuards(UtGuard)
  @ApiOperation({ summary: 'Create a mentor profile for the authenticated user' })
  createMentorProfile(@Body() dto: CreateMentorProfileDto, @Req() req: any) {
    return this.profilesService.createMentorProfile(dto, req.user.sub);
  }

  // --- Profile Management Endpoints (Requires Access Token) ---
  @Get('me')
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Get the full profile of the currently logged-in user' })
  getMyProfile(@Req() req: any) {
    return this.profilesService.findFullProfileByAuthId(req.user.sub);
  }

  @Put('me/student')
  @UseGuards(AtGuard)
  @ApiOperation({ summary: '(Student) Update my own profile details' })
  updateMyStudentProfile(@Body() dto: UpdateStudentProfileDto, @Req() req: any) {
    // In a real app, you'd check if req.user.userType is indeed 'student'
    return this.profilesService.updateOwnStudentProfile(dto, req.user.sub);
  }

  // --- Admin Endpoints ---
  @Patch(':id/status')
  @UseGuards(AtGuard)
  @ApiOperation({ summary: '(Admin) Update the status of any user profile (Staff, Mentor, etc.)' })
  updateUserStatus(
    @Param('id') id: string,
    @Body() dto: UpdateUserStatusDto | UpdatePersonStatusDto,
  ) {
    // Add a PermissionsGuard here for 'user:change-status'
    return this.profilesService.updateUserStatus(id, dto);
  }
}