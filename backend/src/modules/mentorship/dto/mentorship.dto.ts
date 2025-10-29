import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDateString, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, ValidateNested } from 'class-validator';
import { BookingStatus } from 'src/model/booking.entity';

// --- Slot DTOs ---

class CreateSlotPayload {
    @ApiProperty({ description: 'The start time of the slot in ISO 8601 format' })
    @IsDateString()
    startTime: Date;

    @ApiProperty({ description: 'The end time of the slot in ISO 8601 format' })
    @IsDateString()
    endTime: Date;
}

export class CreateSlotsDto {
    @ApiProperty({ 
        description: 'The type of provider creating the slots', 
        enum: ['mentor', 'ambassador'] 
    })
    @IsEnum(['mentor', 'ambassador'])
    providerType: 'mentor' | 'ambassador';

    @ApiProperty({ type: [CreateSlotPayload], description: 'An array of one or more slots to create.' })
    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateSlotPayload)
    slots: CreateSlotPayload[];
}

// --- Booking DTOs ---

export class CreateBookingDto {
    @ApiProperty({ description: 'The unique ID of the slot being booked' })
    @IsUUID()
    slotId: string;

    @ApiPropertyOptional() @IsOptional() @IsString()
    currentOccupation?: string;
    
    @ApiProperty() @IsNotEmpty() @IsString()
    discussionTopic: string;

    @ApiPropertyOptional() @IsOptional() @IsString()
    additionalInfo?: string;
}

export class UpdateBookingStatusDto {
    @ApiProperty({ 
        description: 'The new status for the booking. Typically only "Cancelled" is set by users.',
        enum: [BookingStatus.CANCELLED] 
    })
    @IsEnum([BookingStatus.CANCELLED])
    status: BookingStatus;
}