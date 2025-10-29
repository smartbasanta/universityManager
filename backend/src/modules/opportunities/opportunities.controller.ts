import { Controller, Post, Body, Get, Param, Patch, UseGuards, Req, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { OpportunitiesService } from './opportunities.service';
import { CreateJobDto, UpdateJobDto, CreateScholarshipDto, UpdateScholarshipDto, CreateOpportunityDto, UpdateOpportunityDto } from './dto/opportunities.dto';

@ApiTags('Opportunities')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('opportunities')
export class OpportunitiesController {
  constructor(private readonly opportunitiesService: OpportunitiesService) {}

  // --- Job Endpoints ---
  @Post('jobs')
  @ApiOperation({ summary: 'Create a new job posting' })
  createJob(@Body() dto: CreateJobDto, @Req() req: any) {
    return this.opportunitiesService.createJob(dto, req.user.sub);
  }

  @Get('jobs/:id')
  @ApiOperation({ summary: 'Get a single job by ID' })
  findJob(@Param('id') id: string) {
    return this.opportunitiesService.findJobById(id);
  }

  @Patch('jobs/:id')
  @ApiOperation({ summary: 'Update a job posting' })
  updateJob(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.opportunitiesService.updateJob(id, dto);
  }

  @Delete('jobs/:id')
  @ApiOperation({ summary: 'Delete (soft delete) a job posting' })
  removeJob(@Param('id') id: string) {
    return this.opportunitiesService.removeJob(id);
  }

  // --- Scholarship Endpoints ---
  @Post('scholarships')
  @ApiOperation({ summary: 'Create a new scholarship' })
  createScholarship(@Body() dto: CreateScholarshipDto, @Req() req: any) {
    return this.opportunitiesService.createScholarship(dto, req.user.sub);
  }

  @Get('scholarships/:id')
  @ApiOperation({ summary: 'Get a single scholarship by ID' })
  findScholarship(@Param('id') id: string) {
    return this.opportunitiesService.findScholarshipById(id);
  }

  @Patch('scholarships/:id')
  @ApiOperation({ summary: 'Update a scholarship' })
  updateScholarship(@Param('id') id: string, @Body() dto: UpdateScholarshipDto) {
    return this.opportunitiesService.updateScholarship(id, dto);
  }
  
  @Delete('scholarships/:id')
  @ApiOperation({ summary: 'Delete (soft delete) a scholarship' })
  removeScholarship(@Param('id') id: string) {
    return this.opportunitiesService.removeScholarship(id);
  }

  // --- General Opportunity Endpoints ---
  @Post('general')
  @ApiOperation({ summary: 'Create a new general opportunity (e.g., bootcamp, research)' })
  createOpportunity(@Body() dto: CreateOpportunityDto, @Req() req: any) {
    return this.opportunitiesService.createOpportunity(dto, req.user.sub);
  }

  @Get('general/:id')
  @ApiOperation({ summary: 'Get a single general opportunity by ID' })
  findOpportunity(@Param('id') id: string) {
    return this.opportunitiesService.findOpportunityById(id);
  }

  @Patch('general/:id')
  @ApiOperation({ summary: 'Update a general opportunity' })
  updateOpportunity(@Param('id') id: string, @Body() dto: UpdateOpportunityDto) {
    return this.opportunitiesService.updateOpportunity(id, dto);
  }

  @Delete('general/:id')
  @ApiOperation({ summary: 'Delete (soft delete) a general opportunity' })
  removeOpportunity(@Param('id') id: string) {
    return this.opportunitiesService.removeOpportunity(id);
  }
}