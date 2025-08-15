import { Module } from '@nestjs/common';
import { CreateProduct } from './use-cases/create-product/create-product.controller';
import { GetAllProducts } from './use-cases/get-all-products/get-all-products.controller';
import { DeleteProduct } from './use-cases/delete-product/delete-product.controller';
import { UpdateProduct } from './use-cases/update-single-product/update-product.controller';

@Module({
  controllers: [CreateProduct, GetAllProducts, DeleteProduct, UpdateProduct],
})
export class ProductManagementModule {}
