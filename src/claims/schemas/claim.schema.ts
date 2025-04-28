import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { Policy } from '../../policies/schemas/policy.schema';

export enum ClaimStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

@Schema({ timestamps: true })
export class Claim extends Document {
  @Prop({ required: true })
  claimNumber: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'Policy' })
  policyId: Policy;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  incidentDate: Date;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  claimAmount: number;

  @Prop({ enum: ClaimStatus, default: ClaimStatus.SUBMITTED })
  status: ClaimStatus;

  @Prop()
  supportingDocuments: string[];

  @Prop()
  reviewNotes: string;

  @Prop()
  approvedAmount: number;

  @Prop()
  paymentDate: Date;

  @Prop()
  rejectionReason: string;
}

export const ClaimSchema = SchemaFactory.createForClass(Claim);