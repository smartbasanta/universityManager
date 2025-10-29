import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AuthModule } from './modules/auth/auth.module';
import { UniversityModule } from './modules/university/university.module';
import { SeedModule } from './modules/seed/seed.module';
import { MailModule } from './modules/mail/mail.module';
import { PermissionModule } from './modules/access-control/permission/permission.module';
import { RoleModule } from './modules/access-control/role/role.module';
import { AcademicsModule } from './modules/academics/academics.module';
import { OpportunitiesModule } from './modules/opportunities/opportunities.module';
import { ContentModule } from './modules/content/content.module';
import { MentorshipModule } from './modules/mentorship/mentorship.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { WebsiteModule } from './modules/website/website.module';

import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

import { databaseConfig } from './config/database.config';
import { ReviewsModule } from './modules/reviews/reviews.module';


@Module({
  imports: [
    // 1. Configuration Module (should be first)
    // This makes .env variables available application-wide
    ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig], // Load your database config
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '../', 'uploads'),
      serveRoot: '/uploads',
    }),
    // 2. TypeORM Module (Database Connection)
    // Uses the loaded configuration asynchronously
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
      }),
    }),

    MailModule,
    PermissionModule, // Access control is foundational
    RoleModule,         // Access control is foundational
    AuthModule,
    UniversityModule,
    AcademicsModule,
    OpportunitiesModule,
    ContentModule,
    MentorshipModule,
    ProfilesModule,
    WebsiteModule,
    ReviewsModule,
    
    // --- SEED MODULE (often last, as it depends on all other entities) ---
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
