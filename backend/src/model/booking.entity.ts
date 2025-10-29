import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { parentEntity } from './parent.entity';
import { SlotEntity } from './slot.entity';
import { StudentEntity } from './student.entity';

export enum BookingStatus {
  ACKNOWLEDGED = 'Acknowledged',
  BOOKED = 'Booked',
  CANCELLED = 'Cancelled',
}

@Entity('bookings')
export class BookingEntity extends parentEntity {
  @ManyToOne(() => StudentEntity, (student) => student.bookings, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'studentId' })
  student: StudentEntity;

  @OneToOne(() => SlotEntity, (slot) => slot.booking, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'slotId' })
  slot: SlotEntity;

  @Column({ type: 'text', nullable: true })
  currentOccupation: string;

  @Column({ type: 'text', nullable: true })
  discussionTopic: string;

  @Column({ type: 'text', nullable: true })
  additionalInfo: string;

  @Column({ type: 'boolean', default: false })
  attended: boolean;

  @Column({ type: 'enum', enum: BookingStatus, default: BookingStatus.BOOKED })
  status: BookingStatus;
}
