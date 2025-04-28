import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type InsuranceProductDocument = InsuranceProduct & Document;

export enum InsuranceType {
  LIFE = 'LIFE',
  HEALTH = 'HEALTH',
  AUTO = 'AUTO',
  HOME = 'HOME',
  TRAVEL = 'TRAVEL',
}

export enum CoverageLevel {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  CUSTOM = 'CUSTOM',
}

@Schema({ timestamps: true })
export class InsuranceProduct {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: true, enum: InsuranceType })
  type: InsuranceType;

  @Prop({ required: true, enum: CoverageLevel })
  coverageLevel: CoverageLevel;

  @Prop({ required: true })
  basePremium: number;

  @Prop({ type: Object, default: {} })
  coverageDetails: Record<string, any>;

  @Prop({ default: true })
  isActive: boolean;
}

export const InsuranceProductSchema = SchemaFactory.createForClass(InsuranceProduct);