import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { InsuranceProductsService } from './insurance-products.service';
import { CreateInsuranceProductDto } from './dto/create-insurance-product.dto';
import { InsuranceProduct } from './schemas/insurance-product.schema';

@ApiTags('insurance-products')
@Controller('insurance-products')
export class InsuranceProductsController {
  constructor(private readonly insuranceProductsService: InsuranceProductsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new insurance product' })
  @ApiResponse({ status: 201, description: 'The product has been successfully created.' })
  create(@Body() createInsuranceProductDto: CreateInsuranceProductDto): Promise<InsuranceProduct> {
    return this.insuranceProductsService.create(createInsuranceProductDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all insurance products' })
  findAll(): Promise<InsuranceProduct[]> {
    return this.insuranceProductsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an insurance product by ID' })
  findOne(@Param('id') id: string): Promise<InsuranceProduct> {
    return this.insuranceProductsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an insurance product' })
  update(
    @Param('id') id: string,
    @Body() updateInsuranceProductDto: Partial<CreateInsuranceProductDto>,
  ): Promise<InsuranceProduct> {
    return this.insuranceProductsService.update(id, updateInsuranceProductDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an insurance product' })
  remove(@Param('id') id: string): Promise<InsuranceProduct> {
    return this.insuranceProductsService.remove(id);
  }
}