import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import { InsuranceProduct } from '../../insurance-products/schemas/insurance-product.schema';

export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELLED = 'CANCELLED',
}

@Schema({ timestamps: true })
export class Policy extends Document {
  @Prop({ required: true })
  policyNumber: string;

  @Prop({ required: true, type: MongooseSchema.Types.ObjectId, ref: 'InsuranceProduct' })
  insuranceProductId: InsuranceProduct;

  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  startDate: Date;

  @Prop({ required: true })
  endDate: Date;

  @Prop({ required: true })
  premium: number;

  @Prop({ required: true, enum: PolicyStatus, default: PolicyStatus.PENDING })
  status: PolicyStatus;

  @Prop({ type: Object })
  coverageDetails: Record<string, any>;

  @Prop()
  beneficiaries: string[];

  @Prop()
  cancellationDate: Date;

  @Prop()
  cancellationReason: string;
}

export const PolicySchema = SchemaFactory.createForClass(Policy);