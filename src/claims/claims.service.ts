import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Claim, ClaimStatus } from './schemas/claim.schema';
import { CreateClaimDto } from './dto/create-claim.dto';
import { UpdateClaimStatusDto } from './dto/update-claim-status.dto';
import { PoliciesService } from '../policies/policies.service';
import { PolicyStatus } from '../policies/schemas/policy.schema';

@Injectable()
export class ClaimsService {
  constructor(
    @InjectModel(Claim.name) private claimModel: Model<Claim>,
    private policiesService: PoliciesService,
  ) {}

  async create(createClaimDto: CreateClaimDto): Promise<Claim> {
    // Check if policy exists and is active
    const policy = await this.policiesService.findOne(createClaimDto.policyId);
    
    if (policy.status !== PolicyStatus.ACTIVE) {
      throw new BadRequestException(`Cannot create claim for policy with status ${policy.status}`);
    }
    
    // Generate claim number
    const claimNumber = `CLM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    
    const newClaim = new this.claimModel({
      ...createClaimDto,
      claimNumber,
      userId: policy.userId,
      status: ClaimStatus.SUBMITTED,
    });
    
    return newClaim.save();
  }

  async findAll(): Promise<Claim[]> {
    return this.claimModel.find().exec();
  }

  async findOne(id: string): Promise<Claim> {
    const claim = await this.claimModel.findById(id).exec();
    
    if (!claim) {
      throw new NotFoundException(`Claim with ID ${id} not found`);
    }
    
    return claim;
  }

  async findByPolicyId(policyId: string): Promise<Claim[]> {
    // Check if policy exists
    await this.policiesService.findOne(policyId);
    
    return this.claimModel.find({ policyId }).exec();
  }

  async updateStatus(id: string, updateClaimStatusDto: UpdateClaimStatusDto): Promise<Claim> {
    const claim = await this.findOne(id);
    
    // Validate status transition
    this.validateStatusTransition(claim.status, updateClaimStatusDto.status);
    
    // Update additional fields based on status
    const updateData: any = { status: updateClaimStatusDto.status };
    
    if (updateClaimStatusDto.status === ClaimStatus.APPROVED) {
      updateData.approvedAmount = updateClaimStatusDto.approvedAmount;
      updateData.reviewNotes = updateClaimStatusDto.reviewNotes;
    } else if (updateClaimStatusDto.status === ClaimStatus.REJECTED) {
      updateData.rejectionReason = updateClaimStatusDto.rejectionReason;
      updateData.reviewNotes = updateClaimStatusDto.reviewNotes;
    } else if (updateClaimStatusDto.status === ClaimStatus.PAID) {
      updateData.paymentDate = new Date();
    }
    
    const updatedClaim = await this.claimModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
    
    return updatedClaim;
  }

  private validateStatusTransition(currentStatus: ClaimStatus, newStatus: ClaimStatus): void {
    const validTransitions = {
      [ClaimStatus.SUBMITTED]: [ClaimStatus.UNDER_REVIEW, ClaimStatus.REJECTED],
      [ClaimStatus.UNDER_REVIEW]: [ClaimStatus.APPROVED, ClaimStatus.REJECTED],
      [ClaimStatus.APPROVED]: [ClaimStatus.PAID],
      [ClaimStatus.REJECTED]: [],
      [ClaimStatus.PAID]: [],
    };
    
    if (!validTransitions[currentStatus].includes(newStatus)) {
      throw new BadRequestException(
        `Cannot transition claim from ${currentStatus} to ${newStatus}`,
      );
    }
  }
}