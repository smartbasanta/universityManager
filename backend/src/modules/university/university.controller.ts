import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { UniversityService } from './university.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { UtGuard } from 'src/middlewares/utils_token/ut.guard';
import { AtGuard } from 'src/middlewares/access_token/at.guard';

@ApiTags('Universities')
@ApiBearerAuth('access-token')
@Controller('universities')
export class UniversityController {
  constructor(private readonly universityService: UniversityService) {}

  @Post()
  @UseGuards(UtGuard) // Requires a utility token from email verification to create a university
  @ApiOperation({ summary: 'Create a new university profile' })
  create(@Body() createUniversityDto: CreateUniversityDto, @Req() req: any) {
    return this.universityService.create(createUniversityDto, req.user);
  }

  @Get()
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Get a list of all universities accessible to the user' })
  findAll(@Req() req: any) {
    return this.universityService.findAll(req.user);
  }

  @Get(':id')
  // Publicly accessible for now, but could be guarded with AtGuard if needed
  @ApiOperation({ summary: 'Get a single university by ID with full details' })
  findOne(@Param('id') id: string) {
    return this.universityService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Update a university profile' })
  // Add a permissions guard here, e.g., @Permissions('university:edit-profile')
  update(@Param('id') id: string, @Body() updateUniversityDto: UpdateUniversityDto) {
    return this.universityService.update(id, updateUniversityDto);
  }

  @Delete(':id')
  @UseGuards(AtGuard)
  @ApiOperation({ summary: 'Delete a university' })
  // Add a permissions guard here, e.g., @Permissions('university:delete')
  remove(@Param('id') id: string) {
    return this.universityService.remove(id);
  }
}