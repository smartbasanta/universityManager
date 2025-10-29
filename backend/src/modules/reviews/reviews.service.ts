import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ReviewEntity } from 'src/model/review.entity';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';
import { AuthEntity } from 'src/model/auth.entity';
import { UniversityEntity } from 'src/model/university.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(ReviewEntity) private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(UniversityEntity) private readonly universityRepo: Repository<UniversityEntity>,
  ) {}

  async create(dto: CreateReviewDto, user: AuthEntity): Promise<ReviewEntity> {
    if (!user.student) throw new ForbiddenException('Only students can post reviews.');

    const university = await this.universityRepo.findOneByOrFail({ id: dto.universityId });
    
    // Optional: Prevent a student from reviewing the same university twice
    const existingReview = await this.reviewRepo.findOneBy({ student: { id: user.student.id }, university: { id: university.id } });
    if (existingReview) throw new ForbiddenException('You have already submitted a review for this university.');

    const review = this.reviewRepo.create({
      ...dto,
      student: user.student,
      author: user.student, // Fulfilling both relations from entity
      university,
    });
    return this.reviewRepo.save(review);
  }

  // This is a public method, no auth required
  async findByUniversity(universityId: string): Promise<ReviewEntity[]> {
    return this.reviewRepo.find({
      where: { university: { id: universityId } },
      relations: ['student'],
      order: { createdAt: 'DESC' },
    });
  }

  async update(id: string, dto: UpdateReviewDto, user: AuthEntity): Promise<ReviewEntity> {
    const review = await this.reviewRepo.findOneOrFail({ where: { id }, relations: ['student.auth'] });
    if (review.student.auth.id !== user.id) {
      throw new ForbiddenException('You can only edit your own review.');
    }
    const updatedReview = this.reviewRepo.merge(review, dto);
    return this.reviewRepo.save(updatedReview);
  }

  async remove(id: string, user: AuthEntity): Promise<void> {
    const review = await this.reviewRepo.findOneOrFail({ where: { id }, relations: ['student.auth'] });
    if (review.student.auth.id !== user.id) {
      throw new ForbiddenException('You can only delete your own review.');
    }
    await this.reviewRepo.delete(id);
  }
}