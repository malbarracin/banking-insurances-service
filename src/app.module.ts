import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { InsuranceProductsModule } from './insurance-products/insurance-products.module';
import { PoliciesModule } from './policies/policies.module';
import { ClaimsModule } from './claims/claims.module';
import { UsersModule } from './users/users.module';
import { HealthModule } from './health/health.module';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    MongooseModule.forRoot(process.env.DATABASE_URL || ''),
    InsuranceProductsModule,
    PoliciesModule,
    ClaimsModule,
    UsersModule,
    HealthModule,
  ],
})
export class AppModule {}