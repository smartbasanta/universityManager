import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MentorshipService } from './mentorship.service';
import { MentorshipController } from './mentorship.controller';
import { SlotEntity } from 'src/model/slot.entity';
import { BookingEntity } from 'src/model/booking.entity';
import { MentorInResidenceEntity } from 'src/model/mentor_in_residence.entity';
import { StudentAmbassadorEntity } from 'src/model/student_ambassador.entity';
import { StudentEntity } from 'src/model/student.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SlotEntity,
      BookingEntity,
      MentorInResidenceEntity,
      StudentAmbassadorEntity,
      StudentEntity,
    ]),
  ],
  controllers: [MentorshipController],
  providers: [MentorshipService],
})
export class MentorshipModule {}