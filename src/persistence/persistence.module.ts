import { Global, Module } from '@nestjs/common';
import { ProductRepositoryInMemory } from './product.repository';
import { UserRepositoryInMemory } from './user.repository';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { IUserRepository } from '@auth/ports/user.repository.interface';

@Global()
@Module({
  providers: [
    // Here you would import and provide your persistence-related services
    // For example, database connections, repositories, etc.
    { provide: IProductRepository, useClass: ProductRepositoryInMemory },
    { provide: IUserRepository, useClass: UserRepositoryInMemory },
  ],
  exports: [
    // Export the repository so it can be used in other modules
    IProductRepository,
    IUserRepository,
  ],
})
export class PersistenceModule {}
