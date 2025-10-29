
import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { AtGuard } from 'src/middlewares/access_token/at.guard';
import { AcademicsService } from './academics.service';
import { CreateDepartmentDto, CreateProgramDto } from './dto/academics.dto';
@ApiTags('Academics')
@ApiBearerAuth('access-token')
@UseGuards(AtGuard)
@Controller('academics')
export class AcademicsController {
constructor(private readonly academicsService: AcademicsService) {}

@Post('departments')
@ApiOperation({ summary: 'Create a new department for a university' })
createDepartment(@Body() dto: CreateDepartmentDto) {
    return this.academicsService.createDepartment(dto);
}

@Get('departments/by-university/:universityId')
@ApiOperation({ summary: 'Get all departments for a university' })
getDepartments(@Param('universityId') universityId: string) {
    return this.academicsService.findDepartmentsByUniversity(universityId);
}

@Post('programs')
@ApiOperation({ summary: 'Create a new program within a department' })
createProgram(@Body() dto: CreateProgramDto) {
    return this.academicsService.createProgram(dto);
}
}