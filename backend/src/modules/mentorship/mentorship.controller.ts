import { Controller, Post, Body, Get, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { MentorshipService } from './mentorship.service';
import { CreateSlotsDto, CreateBookingDto } from './dto/mentorship.dto';

@ApiTags('Mentorship & Bookings')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('mentorship')
export class MentorshipController {
  constructor(private readonly mentorshipService: MentorshipService) {}

  // --- Provider-Specific Endpoints ---
  @Post('slots')
  @ApiOperation({ summary: '(Provider) Create one or more availability slots' })
  createSlots(@Body() dto: CreateSlotsDto, @Req() req: any) {
    return this.mentorshipService.createSlots(dto, req.user);
  }

  @Get('my-schedule')
  @ApiOperation({ summary: '(Provider) Get my upcoming scheduled (booked) slots' })
  getMySchedule(@Req() req: any) {
    return this.mentorshipService.findMyScheduledSlots(req.user);
  }

  // --- Student-Specific Endpoints ---
  @Get('slots/available')
  @ApiOperation({ summary: '(Student) Find all available slots for a specific provider' })
  @ApiQuery({ name: 'providerType', enum: ['mentor', 'ambassador'] })
  @ApiQuery({ name: 'providerId', type: String })
  findAvailableSlots(
    @Query('providerType') providerType: 'mentor' | 'ambassador',
    @Query('providerId') providerId: string,
  ) {
    return this.mentorshipService.findAvailableSlots(providerType, providerId);
  }

  @Post('bookings')
  @ApiOperation({ summary: '(Student) Book an available slot' })
  bookSlot(@Body() dto: CreateBookingDto, @Req() req: any) {
    return this.mentorshipService.bookSlot(dto, req.user);
  }

  @Delete('bookings/:id')
  @ApiOperation({ summary: '(Student) Cancel my booking' })
  cancelBooking(@Param('id') id: string, @Req() req: any) {
    return this.mentorshipService.cancelBooking(id, req.user);
  }

  @Get('my-bookings')
  @ApiOperation({ summary: '(Student) Get all of my upcoming and past bookings' })
  getMyBookings(@Req() req: any) {
    return this.mentorshipService.findMyBookings(req.user);
  }
}