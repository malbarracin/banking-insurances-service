import { Controller, Get, Post, Body, Param, Put, Patch, Res, NotFoundException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { PoliciesService } from './policies.service';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { CancelPolicyDto } from './dto/cancel-policy.dto';
import { Policy } from './schemas/policy.schema';
import { Response } from 'express';
import * as fs from 'fs';

@ApiTags('policies')
@Controller('policies')
export class PoliciesController {
  constructor(private readonly policiesService: PoliciesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new policy' })
  @ApiResponse({ status: 201, description: 'The policy has been successfully created.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  create(@Body() createPolicyDto: CreatePolicyDto): Promise<Policy> {
    return this.policiesService.create(createPolicyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all policies' })
  @ApiResponse({ status: 200, description: 'Return all policies.' })
  findAll(): Promise<Policy[]> {
    return this.policiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a policy by id' })
  @ApiParam({ name: 'id', description: 'Policy id' })
  @ApiResponse({ status: 200, description: 'Return the policy.' })
  @ApiResponse({ status: 404, description: 'Policy not found.' })
  findOne(@Param('id') id: string): Promise<Policy> {
    return this.policiesService.findOne(id);
  }

  @Get('user/:userId')
  @ApiOperation({ summary: 'Get policies by user id' })
  @ApiParam({ name: 'userId', description: 'User id' })
  @ApiResponse({ status: 200, description: 'Return the policies.' })
  findByUserId(@Param('userId') userId: string): Promise<Policy[]> {
    return this.policiesService.findByUserId(userId);
  }
  
  @Get('user/dni/:dni')
  @ApiOperation({ summary: 'Get policies by user DNI' })
  @ApiParam({ name: 'dni', description: 'User DNI (Document Number)' })
  @ApiResponse({ status: 200, description: 'Return the policies.' })
  @ApiResponse({ status: 404, description: 'User not found.' })
  findByUserDni(@Param('dni') dni: string): Promise<Policy[]> {
    return this.policiesService.findByUserDni(dni);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a policy' })
  @ApiParam({ name: 'id', description: 'Policy id' })
  @ApiResponse({ status: 200, description: 'The policy has been successfully updated.' })
  @ApiResponse({ status: 404, description: 'Policy not found.' })
  update(
    @Param('id') id: string,
    @Body() updatePolicyDto: UpdatePolicyDto,
  ): Promise<Policy> {
    return this.policiesService.update(id, updatePolicyDto);
  }

  @Patch(':id/cancel')
  @ApiOperation({ summary: 'Cancel a policy' })
  @ApiParam({ name: 'id', description: 'Policy id' })
  @ApiResponse({ status: 200, description: 'The policy has been successfully cancelled.' })
  @ApiResponse({ status: 400, description: 'Bad Request.' })
  @ApiResponse({ status: 404, description: 'Policy not found.' })
  cancel(
    @Param('id') id: string,
    @Body() cancelPolicyDto: CancelPolicyDto,
  ): Promise<Policy> {
    return this.policiesService.cancelPolicy(id, cancelPolicyDto.reason);
  }

  @Get(':id/pdf')
  @ApiOperation({ summary: 'Generate a PDF document for a policy' })
  @ApiParam({ name: 'id', description: 'Policy ID' })
  @ApiResponse({ status: 200, description: 'Returns the policy PDF document' })
  @ApiResponse({ status: 404, description: 'Policy not found' })
  async generatePolicyPdf(
    @Param('id') id: string,
    @Res() res: Response

  ): Promise<void> {
    try {
      const pdfPath = await this.policiesService.generatePolicyPdf(id);
      
      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=policy_${id}.pdf`);
      
      // Stream the file to the response
      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
      
      // Delete the file after sending
      fileStream.on('end', () => {
        fs.unlink(pdfPath, (err) => {
          if (err) {
            console.error(`Error deleting temporary PDF file: ${err.message}`);
          }
        });
      });
    } catch (error) {
      if (error instanceof NotFoundException) {
        res.status(404).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Error generating PDF', error: error.message });
      }
    }
  }
}