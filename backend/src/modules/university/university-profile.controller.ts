import { Controller, Put, Body, Param, UseGuards, Post, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { UniversityProfileService } from './university-profile.service';
import { UpdateCareerOutcomesDto, CreateNotableAlumniDto, CreateResearchHubDto } from './dto/update-university-sections.dto';

@ApiTags('Universities - Profile Sections')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('universities/:universityId/profile')
export class UniversityProfileController {
  constructor(private readonly profileService: UniversityProfileService) {}

  @Put('career-outcomes')
  @ApiOperation({ summary: "Update a university's career outcomes section" })
  updateCareerOutcomes(@Param('universityId') universityId: string, @Body() dto: UpdateCareerOutcomesDto) {
    return this.profileService.updateCareerOutcomes(universityId, dto);
  }

  @Post('notable-alumni')
  @ApiOperation({ summary: 'Add a notable alumni to the university profile' })
  addNotableAlumni(@Param('universityId') universityId: string, @Body() dto: CreateNotableAlumniDto) {
    return this.profileService.addNotableAlumni(universityId, dto);
  }

  @Delete('notable-alumni/:alumniId')
  @ApiOperation({ summary: 'Remove a notable alumni from the university profile' })
  removeNotableAlumni(@Param('alumniId') alumniId: string) {
    return this.profileService.removeNotableAlumni(alumniId);
  }
  
  @Post('research-hubs')
  @ApiOperation({ summary: 'Add a research hub to the university profile' })
  addResearchHub(@Param('universityId') universityId: string, @Body() dto: CreateResearchHubDto) {
    return this.profileService.addResearchHub(universityId, dto);
  }

  @Delete('research-hubs/:hubId')
  @ApiOperation({ summary: 'Remove a research hub from the university profile' })
  removeResearchHub(@Param('hubId') hubId: string) {
    return this.profileService.removeResearchHub(hubId);
  }
}