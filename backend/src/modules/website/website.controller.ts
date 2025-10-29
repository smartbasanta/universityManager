import { Controller, Get, Query, ParseIntPipe, DefaultValuePipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { WebsiteService } from './website.service';

@ApiTags('Website (Public Endpoints)')
@Controller('website')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Get('featured-universities')
  @ApiOperation({ summary: 'Get featured universities for the homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getUniversities(@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number) {
    return this.websiteService.findFeaturedUniversities(limit);
  }

  @Get('research-news')
  @ApiOperation({ summary: 'Get featured research news for the homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getNews(@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number) {
    return this.websiteService.findFeaturedNews(limit);
  }

  @Get('scholarships')
  @ApiOperation({ summary: 'Get live scholarships for the homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getScholarships(@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number) {
    return this.websiteService.findLiveScholarships(limit);
  }

  @Get('jobs')
  @ApiOperation({ summary: 'Get live jobs for the homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getJobs(@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number) {
    return this.websiteService.findLiveJobs(limit);
  }

  @Get('opportunities')
  @ApiOperation({ summary: 'Get live opportunities for the homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getOpportunities(@Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number) {
    return this.websiteService.findLiveOpportunities(limit);
  }

  @Get('ambassadors')
  @ApiOperation({ summary: 'Get active student ambassadors for the homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getAmbassadors(@Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number) {
    return this.websiteService.findActiveAmbassadors(limit);
  }

  @Get('mentors')
  @ApiOperation({ summary: 'Get active mentors for the homepage' })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  getMentors(@Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number) {
    return this.websiteService.findActiveMentors(limit);
  }
}