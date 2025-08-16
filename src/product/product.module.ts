import { Module } from '@nestjs/common';
import { CreateProduct } from './use-cases/create-product/create-product.controller';
import { GetAllProducts } from './use-cases/get-all-products/get-all-products.controller';
import { DeleteProduct } from './use-cases/delete-product/delete-product.controller';
import { UpdateProduct } from './use-cases/update-single-product/update-product.controller';
import { AuthModule } from '@auth/auth.module';
import { UserRolesGuard } from '@auth/infra/guards/role.guard';
import { APP_GUARD } from '@nestjs/core';

@Module({
  imports: [AuthModule],
  controllers: [CreateProduct, GetAllProducts, DeleteProduct, UpdateProduct],
  providers: [
    {
      provide: APP_GUARD,
      useClass: UserRolesGuard,
    },
  ],
})
export class ProductManagementModule {}
