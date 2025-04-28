import { IsString, IsEnum, IsNumber, IsObject, IsBoolean, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { InsuranceType, CoverageLevel } from '../schemas/insurance-product.schema';

export class CreateInsuranceProductDto {
  @ApiProperty({ description: 'Name of the insurance product' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'Description of the insurance product' })
  @IsString()
  description: string;

  @ApiProperty({ enum: InsuranceType, description: 'Type of insurance' })
  @IsEnum(InsuranceType)
  type: InsuranceType;

  @ApiProperty({ enum: CoverageLevel, description: 'Level of coverage' })
  @IsEnum(CoverageLevel)
  coverageLevel: CoverageLevel;

  @ApiProperty({ description: 'Base premium amount' })
  @IsNumber()
  basePremium: number;

  @ApiProperty({ description: 'Detailed coverage information', type: 'object' })
  @IsObject()
  coverageDetails: Record<string, any>;

  @ApiProperty({ description: 'Whether the product is active', default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}