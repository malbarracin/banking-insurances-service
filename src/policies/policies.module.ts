import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PoliciesController } from './policies.controller';
import { PoliciesService } from './policies.service';
import { Policy, PolicySchema } from './schemas/policy.schema';
import { InsuranceProductsModule } from '../insurance-products/insurance-products.module';
import { UsersModule } from '../users/users.module';
import { PdfGeneratorService } from '../utils/pdf-generator.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Policy.name, schema: PolicySchema }]),
    InsuranceProductsModule,
    UsersModule,
  ],
  controllers: [PoliciesController],
  providers: [PoliciesService, PdfGeneratorService],
  exports: [PoliciesService],
})
export class PoliciesModule {}