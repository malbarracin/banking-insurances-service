import { IsString, IsDate, IsNumber, IsArray, IsOptional, IsObject, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePolicyDto {
  @ApiProperty({ description: 'ID of the insurance product' })
  @IsMongoId()
  insuranceProductId: string;

  @ApiProperty({ description: 'ID of the user' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Start date of the policy' })
  @IsDate()
  @Type(() => Date)
  startDate: Date;

  @ApiProperty({ description: 'End date of the policy' })
  @IsDate()
  @Type(() => Date)
  endDate: Date;

  @ApiProperty({ description: 'Premium amount' })
  @IsNumber()
  premium: number;

  @ApiProperty({ description: 'Coverage details', type: 'object' })
  @IsObject()
  @IsOptional()
  coverageDetails?: Record<string, any>;

  @ApiProperty({ description: 'Beneficiaries', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  beneficiaries?: string[];
}