import { Controller, Get, Post, Body, Param, Patch } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { ClaimsService } from './claims.service';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimStatusDto } from './dto/update-claim-status.dto';
import { Claim } from './schemas/claim.schema';

@ApiTags('claims')
@Controller('claims')
export class ClaimsController {
  constructor(private readonly claimsService: ClaimsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new claim' })
  @ApiResponse({ status: 201, description: 'The claim has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createClaimDto: CreateClaimDto): Promise<Claim> {
    return this.claimsService.create(createClaimDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all claims' })
  @ApiResponse({ status: 200, description: 'Return all claims.' })
  findAll(): Promise<Claim[]> {
    return this.claimsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a claim by id' })
  @ApiParam({ name: 'id', description: 'Claim id' })
  @ApiResponse({ status: 200, description: 'Return the claim.' })
  @ApiResponse({ status: 404, description: 'Claim not found.' })
  findOne(@Param('id') id: string): Promise<Claim> {
    return this.claimsService.findOne(id);
  }

  @Get('policy/:policyId')
  @ApiOperation({ summary: 'Get claims by policy id' })
  @ApiParam({ name: 'policyId', description: 'Policy id' })
  @ApiResponse({ status: 200, description: 'Return the claims.' })
  findByPolicyId(@Param('policyId') policyId: string): Promise<Claim[]> {
    return this.claimsService.findByPolicyId(policyId);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Update claim status' })
  @ApiParam({ name: 'id', description: 'Claim id' })
  @ApiResponse({ status: 200, description: 'The claim status has been successfully updated.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Claim not found.' })
  updateStatus(
    @Param('id') id: string,
    @Body() updateClaimStatusDto: UpdateClaimStatusDto,
  ): Promise<Claim> {
    return this.claimsService.updateStatus(id, updateClaimStatusDto);
  }
}