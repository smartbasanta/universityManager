import { ApiProperty } from '@nestjs/swagger';
export class UniversityOverviewAcceptenceRateDto {
  @ApiProperty({ example: '0.85', nullable: true })
  acceptance_rate: string;
  @ApiProperty({ example: '2025', nullable: true })
  year: string;
  @ApiProperty({ example: 'Undergraduate', nullable: true })
  type: string;
  @ApiProperty({ example: 'Bachelor', nullable: true })
  level: string;
}
export class UniversityAvgAnualCostDto {
  @ApiProperty({ example: '20000', nullable: true })
  avg_anual_cost: string | null;
  @ApiProperty({
    example: 'Average annual cost for tuition and fees',
    nullable: true,
  })
  description: string;
}
export class UniversityOverviewDto {
  @ApiProperty({ example: '15:1', nullable: true })
  student_to_faculty_ratio: string | null;
  @ApiProperty({ example: '500000', nullable: true })
  research_expenditure: string | null;
  @ApiProperty({
    example: 'A prestigious university located in...',
    nullable: true,
  })
  description: string | null;
  @ApiProperty({ example: 'USA', nullable: true })
  country: string | null;
  @ApiProperty({ example: '123 University St', nullable: true })
  street: string | null;
  @ApiProperty({ example: 'California', nullable: true })
  state: string | null;
  @ApiProperty({ example: 'Urban', nullable: true })
  area_type: string;
  @ApiProperty({ example: 'Public', nullable: true })
  university_type: string;
  @ApiProperty({ example: true })
  isDraft: boolean;
  @ApiProperty({ type: [UniversityOverviewAcceptenceRateDto], nullable: true })
  university_overview_acceptence_rate: UniversityOverviewAcceptenceRateDto[];
  @ApiProperty({ type: [UniversityAvgAnualCostDto], nullable: true })
  university_avg_anual_cost: UniversityAvgAnualCostDto[];
}
