import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Policy, PolicyStatus } from './schemas/policy.schema';
import { CreatePolicyDto } from './dto/create-policy.dto';
import { UpdatePolicyDto } from './dto/update-policy.dto';
import { PdfGeneratorService } from '../utils/pdf-generator.service';
import { InsuranceProductsService } from '../insurance-products/insurance-products.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class PoliciesService {
  constructor(
    @InjectModel(Policy.name) private policyModel: Model<Policy>,
    private readonly insuranceProductsService: InsuranceProductsService,
    private readonly usersService: UsersService,
    private readonly pdfGeneratorService: PdfGeneratorService
  ) {}

  async create(createPolicyDto: CreatePolicyDto): Promise<Policy> {
    // Check if insurance product exists
    await this.insuranceProductsService.findOne(createPolicyDto.insuranceProductId);
    
    // Check if user exists
    await this.usersService.findOne(createPolicyDto.userId);
    
    // Generate policy number
    const policyNumber = `POL-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const newPolicy = new this.policyModel({
      ...createPolicyDto,
      policyNumber,
      status: PolicyStatus.ACTIVE,
    });
    
    return newPolicy.save();
  }

  async findAll(): Promise<Policy[]> {
    return this.policyModel.find().exec();
  }

  async findOne(id: string): Promise<Policy> {
    const policy = await this.policyModel.findById(id).exec();
    
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    
    return policy;
  }

  async findByUserId(userId: string): Promise<Policy[]> {
    // Check if user exists
    await this.usersService.findOne(userId);
    
    return this.policyModel.find({ userId }).exec();
  }
  
  async findByUserDni(dni: string): Promise<Policy[]> {
    // Find user by DNI
    const user = await this.usersService.findByDni(dni);
    if (!user) {
      throw new NotFoundException(`User with DNI ${dni} not found`);
    }
    
    // Get policies for this user - using _id from the user object
    return this.policyModel.find({ userId: user._id }).exec();
  }

  async update(id: string, updatePolicyDto: UpdatePolicyDto): Promise<Policy> {
    const updatedPolicy = await this.policyModel
      .findByIdAndUpdate(id, updatePolicyDto, { new: true })
      .exec();
    
    if (!updatedPolicy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    
    return updatedPolicy;
  }

  async cancelPolicy(id: string, reason: string): Promise<Policy> {
    const policy = await this.findOne(id);
    
    if (policy.status === PolicyStatus.CANCELLED) {
      throw new BadRequestException('Policy is already cancelled');
    }
    
    policy.status = PolicyStatus.CANCELLED;
    policy.cancellationDate = new Date();
    policy.cancellationReason = reason;
    
    return policy.save();
  }

  async generatePolicyPdf(id: string): Promise<string> {
    const policy = await this.findOne(id);
    
    if (!policy) {
      throw new NotFoundException(`Policy with ID ${id} not found`);
    }
    
    const product = await this.insuranceProductsService.findOne(policy.insuranceProductId.toString());
    const user = await this.usersService.findOne(policy.userId);
    
    return this.pdfGeneratorService.generatePolicyDocument(policy, product, user);
  }
}