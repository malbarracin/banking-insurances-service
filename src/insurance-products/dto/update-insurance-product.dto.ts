import { PartialType } from '@nestjs/swagger';
import { CreateInsuranceProductDto } from './create-insurance-product.dto';

export class UpdateInsuranceProductDto extends PartialType(CreateInsuranceProductDto) {}