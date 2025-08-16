import { Module } from '@nestjs/common';
import { ProductManagementModule } from './product/product.module';
import { PersistenceModule } from './persistence/persistence.module';
import { AuthModule } from './auth/auth.module';
import { AttachmentManagementModule } from './attachment/attachment.module';

@Module({
  imports: [
    ProductManagementModule,
    PersistenceModule,
    AuthModule,
    AttachmentManagementModule,
  ],
})
export class AppModule {}
