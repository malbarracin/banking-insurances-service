import { IsString, IsDate, IsNumber, IsArray, IsOptional, IsMongoId } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateClaimDto {
  @ApiProperty({ description: 'ID of the policy' })
  @IsMongoId()
  policyId: string;

  @ApiProperty({ description: 'Date of the incident' })
  @IsDate()
  @Type(() => Date)
  incidentDate: Date;

  @ApiProperty({ description: 'Description of the claim' })
  @IsString()
  description: string;

  @ApiProperty({ description: 'Amount claimed' })
  @IsNumber()
  claimAmount: number;

  @ApiProperty({ description: 'Supporting documents', type: [String] })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  supportingDocuments?: string[];
}