import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { InsuranceProductsController } from './insurance-products.controller';
import { InsuranceProductsService } from './insurance-products.service';
import { InsuranceProduct, InsuranceProductSchema } from './schemas/insurance-product.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: InsuranceProduct.name, schema: InsuranceProductSchema },
    ]),
  ],
  controllers: [InsuranceProductsController],
  providers: [InsuranceProductsService],
  exports: [InsuranceProductsService],
})
export class InsuranceProductsModule {}