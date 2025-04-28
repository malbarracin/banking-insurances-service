import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Establecer el prefijo global correcto
  app.setGlobalPrefix('banking-insurances-service/api/v1');
  
  // Enable validation
  app.useGlobalPipes(new ValidationPipe());
  
  // Get config service
  const configService = app.get(ConfigService);
  const port = configService.get<number>('port') || 8084;
  
  // Configure Swagger
  const config = new DocumentBuilder()
    .setTitle('Banking Insurances Service API')
    .setDescription('API for managing insurance products, policies, and claims')
    .setVersion('1.0')
    .addServer(`http://localhost:${port}`) 
    .addTag('insurance-products')
    .addTag('policies')
    .addTag('claims')
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  
  await app.listen(port);
  console.log(`Application is running on: http://localhost:${port}`);
  console.log(`Swagger documentation available at: http://localhost:${port}/api`);
}
bootstrap();