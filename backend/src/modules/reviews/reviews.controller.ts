import { Controller, Post, Body, Get, Param, Patch, Delete, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto, UpdateReviewDto } from './dto/review.dto';

@ApiTags('Reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Create a new university review' })
  create(@Body() dto: CreateReviewDto, @Req() req: any) {
    return this.reviewsService.create(dto, req.user);
  }

  @Get('by-university/:universityId')
  @ApiOperation({ summary: 'Get all reviews for a specific university (Public)' })
  findByUniversity(@Param('universityId') universityId: string) {
    return this.reviewsService.findByUniversity(universityId);
  }

  @Patch(':id')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Update your own review' })
  update(@Param('id') id: string, @Body() dto: UpdateReviewDto, @Req() req: any) {
    return this.reviewsService.update(id, dto, req.user);
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  @ApiBearerAuth('access-token')
  @ApiOperation({ summary: 'Delete your own review' })
  remove(@Param('id') id: string, @Req() req: any) {
    return this.reviewsService.remove(id, req.user);
  }
}