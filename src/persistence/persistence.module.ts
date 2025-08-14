import { Global, Module } from '@nestjs/common';
import { ProductRepositoryInMemory } from './product.repository';
import { IProductRepository } from 'src/product/ports/product.repository.interface';

@Global()
@Module({
  providers: [
    // Here you would import and provide your persistence-related services
    // For example, database connections, repositories, etc.
    { provide: IProductRepository, useClass: ProductRepositoryInMemory },
  ],
  exports: [
    // Export the repository so it can be used in other modules
    IProductRepository,
  ],
})
export class PersistenceModule {}
