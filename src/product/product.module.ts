import { Module } from '@nestjs/common';
import { CreateProduct } from './use-cases/create-product/create-product.controller';
import { GetAllProducts } from './use-cases/get-all-products/get-all-products.controller';

@Module({
  controllers: [CreateProduct, GetAllProducts],
})
export class ProductManagementModule {}
