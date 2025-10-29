import { Injectable, NotFoundException, ConflictException, ForbiddenException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, In, Repository } from 'typeorm';
import { SlotEntity, SlotStatus } from 'src/model/slot.entity';
import { BookingEntity, BookingStatus } from 'src/model/booking.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { StudentEntity } from 'src/model/student.entity';
import { CreateSlotsDto, CreateBookingDto } from './dto/mentorship.dto';
import { AuthEntity } from 'src/model/auth.entity';

@Injectable()
export class MentorshipService {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(SlotEntity) private readonly slotRepo: Repository<SlotEntity>,
    @InjectRepository(BookingEntity) private readonly bookingRepo: Repository<BookingEntity>,
    @InjectRepository(StudentEntity) private readonly studentRepo: Repository<StudentEntity>,
  ) {}

  /**
   * Creates availability slots for a given provider (Mentor or Ambassador).
   */
  async createSlots(dto: CreateSlotsDto, user: AuthEntity): Promise<SlotEntity[]> {
    const newSlots: Partial<SlotEntity>[] = [];

    for (const slotDto of dto.slots) {
        const slot: Partial<SlotEntity> = {
            startTime: slotDto.startTime,
            endTime: slotDto.endTime,
            status: SlotStatus.AVAILABLE,
        };

        if (dto.providerType === 'mentor' && user.mentor_in_residence) {
            slot.mentor_in_residence = user.mentor_in_residence;
        } else if (dto.providerType === 'ambassador' && user.student_ambassador) {
            slot.student_ambassador = user.student_ambassador;
        } else {
            throw new ForbiddenException(`User is not a valid provider of type "${dto.providerType}".`);
        }
        newSlots.push(slot);
    }

    const createdSlots = this.slotRepo.create(newSlots);
    return this.slotRepo.save(createdSlots);
  }

  /**
   * Finds all available slots for a specific provider.
   */
  async findAvailableSlots(providerType: 'mentor' | 'ambassador', providerId: string): Promise<SlotEntity[]> {
    const whereCondition = {
        status: SlotStatus.AVAILABLE,
        [providerType === 'mentor' ? 'mentor_in_residence' : 'student_ambassador']: { id: providerId },
    };
    return this.slotRepo.find({ where: whereCondition, order: { startTime: 'ASC' } });
  }

  /**
   * Allows a student to book an available slot within a database transaction.
   */
  async bookSlot(dto: CreateBookingDto, user: AuthEntity): Promise<BookingEntity> {
    const student = await this.studentRepo.findOneBy({ auth: { id: user.id } });
    if (!student) throw new ForbiddenException('Only students can book slots.');

    return this.dataSource.transaction(async manager => {
        try {
            const slotRepo = manager.getRepository(SlotEntity);
            const bookingRepo = manager.getRepository(BookingEntity);
            
            // Lock the slot row to prevent race conditions
            const slot = await slotRepo.findOne({ where: { id: dto.slotId }, lock: { mode: 'pessimistic_write' } });

            if (!slot) throw new NotFoundException('Slot not found.');
            if (slot.status !== SlotStatus.AVAILABLE) throw new ConflictException('This slot is no longer available.');

            // Update slot status
            slot.status = SlotStatus.BOOKED;
            
            // Create the booking record
            const newBooking = bookingRepo.create({ ...dto, student, slot });
            const savedBooking = await bookingRepo.save(newBooking);
            
            // Save the updated slot
            await slotRepo.save(slot);

            return savedBooking;
        } catch (err) {
            throw new InternalServerErrorException(`Failed to book slot: ${err.message}`);
        }
    });
  }
  
  /**
   * Allows a student to cancel their own booking, making the slot available again.
   */
  async cancelBooking(bookingId: string, user: AuthEntity): Promise<{ message: string }> {
      return this.dataSource.transaction(async manager => {
        const bookingRepo = manager.getRepository(BookingEntity);
        const slotRepo = manager.getRepository(SlotEntity);

        const booking = await bookingRepo.findOne({
            where: { id: bookingId },
            relations: ['student', 'student.auth', 'slot'],
        });

        if (!booking) throw new NotFoundException('Booking not found.');
        if (booking.student.auth.id !== user.id) {
            // In a real app, you'd add a check here for admins using PermissionService
            throw new ForbiddenException('You can only cancel your own bookings.');
        }

        const slot = booking.slot;
        slot.status = SlotStatus.AVAILABLE;

        // The booking entity is deleted, and the slot is updated.
        await slotRepo.save(slot);
        await bookingRepo.remove(booking);
        
        return { message: 'Booking cancelled successfully. The slot is now available again.' };
      });
  }

  /**
   * Finds all bookings made by the currently authenticated student.
   */
  async findMyBookings(user: AuthEntity): Promise<BookingEntity[]> {
      const student = await this.studentRepo.findOneBy({ auth: { id: user.id } });
      if (!student) return []; // Not a student, so no bookings.
      
      return this.bookingRepo.find({
          where: { student: { id: student.id } },
          relations: ['slot', 'slot.mentor_in_residence', 'slot.student_ambassador'],
          order: { slot: { startTime: 'ASC' } },
      });
  }

  /**
   * Finds all scheduled (booked) slots for the currently authenticated provider.
   */
  async findMyScheduledSlots(user: AuthEntity): Promise<SlotEntity[]> {
      const provider = user.mentor_in_residence || user.student_ambassador;
      if (!provider) return []; // Not a provider, so no schedule.

      const providerType = user.mentor_in_residence ? 'mentor_in_residence' : 'student_ambassador';

      return this.slotRepo.find({
          where: {
              status: SlotStatus.BOOKED,
              [providerType]: { id: provider.id }
          },
          relations: ['booking', 'booking.student'],
          order: { startTime: 'ASC' },
      });
  }
}