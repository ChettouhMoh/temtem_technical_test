import { Module } from '@nestjs/common';
import { CreateProduct } from './use-cases/create-product/create-product.controller';

@Module({
  controllers: [CreateProduct],
})
export class ProductManagementModule {}
