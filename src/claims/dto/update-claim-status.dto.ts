import { IsEnum, IsNumber, IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ClaimStatus } from '../schemas/claim.schema';

export class UpdateClaimStatusDto {
  @ApiProperty({ enum: ClaimStatus, description: 'New status of the claim' })
  @IsEnum(ClaimStatus)
  status: ClaimStatus;

  @ApiProperty({ description: 'Approved amount (required for APPROVED status)', required: false })
  @IsNumber()
  @IsOptional()
  approvedAmount?: number;

  @ApiProperty({ description: 'Rejection reason (required for REJECTED status)', required: false })
  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @ApiProperty({ description: 'Review notes', required: false })
  @IsString()
  @IsOptional()
  reviewNotes?: string;
}