import { Global, Module } from '@nestjs/common';
import { ProductRepositoryInMemory } from './product.repository';
import { UserRepositoryInMemory } from './user.repository';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { IUserRepository } from '@auth/ports/user.repository.interface';
import { IAttachmentStorage } from '@attachment/ports/attachement.repository.interface';
import { CloudinaryAttachmentAdapter } from '../attachment/cloudinary/cloudinary.adapter';
import { CloudinaryProvider } from '../attachment/cloudinary/cloudinary.provider';

// make it globale module so we can access the repositories in any module without importing it explicitly
@Global()
@Module({
  providers: [
    // Here you would import and provide your persistence-related services
    // For example, database connections, repositories, Adapters, etc.
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
