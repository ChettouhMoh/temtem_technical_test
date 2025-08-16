import { Module } from '@nestjs/common';
import { UploadAttachmentController } from './use-cases/upload-attachment/attachment.controller';
import { CloudinaryAttachmentAdapter } from './cloudinary/cloudinary.adapter';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { IAttachmentStorage } from './ports/attachement.repository.interface';
import { APP_GUARD } from '@nestjs/core';
import { UserRolesGuard } from '@auth/infra/guards/role.guard';
import { AuthModule } from '@auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [UploadAttachmentController],
  providers: [
    { provide: IAttachmentStorage, useClass: CloudinaryAttachmentAdapter },
    CloudinaryProvider,
    {
      provide: APP_GUARD,
      useClass: UserRolesGuard,
    },
  ],
})
export class AttachmentManagementModule {}
