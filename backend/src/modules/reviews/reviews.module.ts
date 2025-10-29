import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { ReviewEntity } from 'src/model/review.entity';
import { UniversityEntity } from 'src/model/university.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ReviewEntity, UniversityEntity])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}