import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResearchNewsEntity } from 'src/model/research_news.entity';
import { CommentEntity } from 'src/model/comment.entity';
import { ReviewEntity } from 'src/model/review.entity';
import { CreateResearchNewsDto, UpdateResearchNewsDto, CreateCommentDto, UpdateCommentStatusDto, CreateReviewDto } from './dto/content.dto';
import { AuthEntity } from 'src/model/auth.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { PermissionService, ScopeFilteringConfig } from '../access-control/permission/permission.service';

@Injectable()
export class ContentService {
  constructor(
    @InjectRepository(ResearchNewsEntity) private readonly newsRepo: Repository<ResearchNewsEntity>,
    @InjectRepository(CommentEntity) private readonly commentRepo: Repository<CommentEntity>,
    @InjectRepository(ReviewEntity) private readonly reviewRepo: Repository<ReviewEntity>,
    @InjectRepository(UniversityEntity) private readonly universityRepo: Repository<UniversityEntity>,
    private readonly permissionService: PermissionService,
  ) {}

  // --- Research News ---
  async createNews(dto: CreateResearchNewsDto, author: AuthEntity): Promise<ResearchNewsEntity> {
    const news = this.newsRepo.create({ ...dto, auth: author });
    if (dto.universityId) {
        news.university = await this.universityRepo.findOneByOrFail({ id: dto.universityId });
    }
    return this.newsRepo.save(news);
  }

  //this function has to be modified
  async findAllNews(user: AuthEntity): Promise<ResearchNewsEntity[]> {
    const qb = this.newsRepo.createQueryBuilder('news');
    
    // News can be scoped to university or department
    const scopeConfig: ScopeFilteringConfig = {
      university: 'universityId',
      department: 'departmentId',
    };
    
    await this.permissionService.applyPermissionScope(qb, user.id, scopeConfig);
    
    return qb.getMany();
  }


  async updateNews(id: string, dto: UpdateResearchNewsDto): Promise<ResearchNewsEntity> {
    const news = await this.newsRepo.findOneByOrFail({ id });
    const updatedNews = this.newsRepo.merge(news, dto);
    return this.newsRepo.save(updatedNews);
  }

  // --- Comments ---
  async createComment(dto: CreateCommentDto, author: AuthEntity): Promise<CommentEntity> {
    const comment = this.commentRepo.create({
      ...dto,
      studentAuthor: author.student, // Assuming the author is a student
    });

    if (dto.parentCommentId) {
      comment.parentComment = await this.commentRepo.findOneByOrFail({ id: dto.parentCommentId });
    }
    
    // Logic to associate with the related entity (e.g., ResearchNews)
    if (dto.related_entity_type === 'research_news') {
        comment.research_news = await this.newsRepo.findOneByOrFail({ id: dto.related_entity_id });
    }

    return this.commentRepo.save(comment);
  }

  async updateCommentStatus(id: string, dto: UpdateCommentStatusDto): Promise<CommentEntity> {
    const comment = await this.commentRepo.findOneByOrFail({ id });
    comment.status = dto.status;
    return this.commentRepo.save(comment);
  }

  // --- Reviews ---
  async createReview(dto: CreateReviewDto, author: AuthEntity): Promise<ReviewEntity> {
    const university = await this.universityRepo.findOneByOrFail({ id: dto.universityId });
    const review = this.reviewRepo.create({
      ...dto,
      author: author.student,
      student: author.student, // Fulfilling both relations
      university,
    });
    return this.reviewRepo.save(review);
  }
}