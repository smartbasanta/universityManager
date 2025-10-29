import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { MentorInResidenceEntity } from './mentor_in_residence.entity';
import { BookingEntity } from './booking.entity';
import { StudentAmbassadorEntity } from './student_ambassador.entity';

export enum SlotStatus {
  AVAILABLE = 'AVAILABLE',
  BOOKED = 'BOOKED',
}

@Entity('slots')
export class SlotEntity extends parentEntity {
  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp' })
  endTime: Date;

  @Column({ type: 'enum', enum: SlotStatus, default: SlotStatus.AVAILABLE })
  status: SlotStatus;

  @ManyToOne(() => MentorInResidenceEntity, (mentor) => mentor.slots, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'mentorId' })
  mentor_in_residence: MentorInResidenceEntity;

  @ManyToOne(
    () => StudentAmbassadorEntity,
    (student_ambassador) => student_ambassador.slots,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'student_ambassadorId' })
  student_ambassador: StudentAmbassadorEntity;

  @OneToOne(() => BookingEntity, (booking) => booking.slot, {
    onDelete: 'CASCADE',
  })
  booking: BookingEntity;
}
