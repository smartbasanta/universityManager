import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContentService } from './content.service';
import { ContentController } from './content.controller';
import { ResearchNewsEntity } from 'src/model/research_news.entity';
import { CommentEntity } from 'src/model/comment.entity';
import { ReviewEntity } from 'src/model/review.entity';
import { UniversityEntity } from 'src/model/university.entity';
import { PermissionModule } from '../access-control/permission/permission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ResearchNewsEntity, CommentEntity, ReviewEntity, UniversityEntity]),
    PermissionModule
  ],
  controllers: [ContentController],
  providers: [ContentService],
})
export class ContentModule {}