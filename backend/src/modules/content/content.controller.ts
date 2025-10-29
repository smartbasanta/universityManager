import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { ContentService } from './content.service';
import { CreateResearchNewsDto, UpdateResearchNewsDto, CreateCommentDto, UpdateCommentStatusDto, CreateReviewDto } from './dto/content.dto';

@ApiTags('Content & Engagement')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @Post('news')
  @ApiOperation({ summary: 'Create a research news article' })
  createNews(@Body() dto: CreateResearchNewsDto, @Req() req: any) {
    return this.contentService.createNews(dto, req.user);
  }
  
  @Patch('news/:id')
  @ApiOperation({ summary: 'Update a research news article' })
  updateNews(@Param('id') id: string, @Body() dto: UpdateResearchNewsDto) {
    return this.contentService.updateNews(id, dto);
  }
  
  @Post('comments')
  @ApiOperation({ summary: 'Post a comment on an entity' })
  createComment(@Body() dto: CreateCommentDto, @Req() req: any) {
    return this.contentService.createComment(dto, req.user);
  }

  @Patch('comments/:id/status')
  @ApiOperation({ summary: 'Update the status of a comment (e.g., approve, hide)' })
  updateCommentStatus(@Param('id') id: string, @Body() dto: UpdateCommentStatusDto) {
    return this.contentService.updateCommentStatus(id, dto);
  }

  @Post('reviews')
  @ApiOperation({ summary: 'Post a university review' })
  createReview(@Body() dto: CreateReviewDto, @Req() req: any) {
    return this.contentService.createReview(dto, req.user);
  }
}