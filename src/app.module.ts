import { Module } from '@nestjs/common';
import { ProductManagementModule } from './product/product.module';
import { PersistenceModule } from './persistence/persistence.module';

@Module({
  imports: [ProductManagementModule, PersistenceModule],
})
export class AppModule {}
