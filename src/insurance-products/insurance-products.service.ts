import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { InsuranceProduct, InsuranceProductDocument } from './schemas/insurance-product.schema';
import { CreateInsuranceProductDto } from './dto/create-insurance-product.dto';

@Injectable()
export class InsuranceProductsService {
  constructor(
    @InjectModel(InsuranceProduct.name) private insuranceProductModel: Model<InsuranceProductDocument>,
  ) {}

  async create(createInsuranceProductDto: CreateInsuranceProductDto): Promise<InsuranceProduct> {
    const createdProduct = new this.insuranceProductModel(createInsuranceProductDto);
    return createdProduct.save();
  }

  async findAll(): Promise<InsuranceProduct[]> {
    return this.insuranceProductModel.find().exec();
  }

  async findOne(id: string): Promise<InsuranceProduct> {
    return this.insuranceProductModel.findById(id).exec();
  }

  async update(id: string, updateInsuranceProductDto: Partial<CreateInsuranceProductDto>): Promise<InsuranceProduct> {
    return this.insuranceProductModel.findByIdAndUpdate(id, updateInsuranceProductDto, { new: true }).exec();
  }

  async remove(id: string): Promise<InsuranceProduct> {
    return this.insuranceProductModel.findByIdAndDelete(id).exec();
  }
}