import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';
import { UniversityService, UniversityWebsiteQueryParams } from './university.service';
import { UniversityProfileService } from './university-profile.service'; // We will use this for section data

// @ApiTags('Website - Universities')
@ApiTags('Website (Public Endpoints)')
@Controller('website/universities') // A distinct prefix for all public university routes
export class UniversityWebsiteController {
  constructor(
      private readonly universityService: UniversityService,
      private readonly profileService: UniversityProfileService // Inject the profile service
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all universities with filtering and search' })
  @ApiQuery({ name: 'search', required: false })
  @ApiQuery({ name: 'country', required: false, description: 'Comma-separated list' })
  @ApiQuery({ name: 'area_type', required: false, description: 'Comma-separated list' })
  @ApiQuery({ name: 'type', required: false, description: 'Comma-separated list' })
  findAllForWebsite(@Query() query: UniversityWebsiteQueryParams) {
    return this.universityService.findForWebsite(query);
  }

  @Get('filters')
  @ApiOperation({ summary: 'Get distinct filter options for the university search page' })
  getFilterOptions() {
    return this.universityService.findFilterOptions();
  }
  
  // --- NEW GRANULAR ENDPOINTS FOR DETAIL PAGE ---

  @Get(':id/basic-info')
  @ApiOperation({ summary: 'Get basic header info for a single university' })
  getBasicInfo(@Param('id') id: string) {
    // We can reuse the main findOne method for this
    return this.universityService.getBasicInfo(id);
  }

  @Get(':id/general-sections')
  @ApiOperation({ summary: 'Get data for the General Info tab' })
  async getGeneralSections(@Param('id') id: string) {
    return this.universityService.getGeneralSections(id);
  }
  
  // --- UNDERGRADUATE TAB SECTION ---
  @Get(':id/undergraduate-section')
  @ApiOperation({ summary: 'Get data for the Undergraduate tab' })
  async getUndergraduateSection(@Param('id') id: string) {
    return this.universityService.getUndergraduateSection(id);
  }

  // --- GRADUATE TAB SECTION ---
  @Get(':id/graduate-section')
  @ApiOperation({ summary: 'Get data for the Graduate tab' })
  async getGraduateSection(@Param('id') id: string) {
    return this.universityService.getGraduateSection(id);
  }

  @Get(':id/career-outcomes')
  @ApiOperation({ summary: "Get a university's career outcomes section" })
  getCareerOutcomes(@Param('id') id: string) {
      return this.profileService.updateCareerOutcomes(id, {}); // A bit of a hack, we can create a dedicated find method later
  }

  // ... You would create similar endpoints for each section:
  // @Get(':id/undergraduate'), @Get(':id/graduate'), @Get(':id/sports'), etc.
  // Each would call a method in UniversityProfileService to fetch just that section's data.
}