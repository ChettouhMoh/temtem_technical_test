import { Module } from '@nestjs/common';
import { UploadAttachmentController } from './use-cases/upload-attachment/attachment.controller';
import { CloudinaryAttachmentAdapter } from './cloudinary/cloudinary.adapter';
import { CloudinaryProvider } from './cloudinary/cloudinary.provider';
import { IAttachmentStorage } from './ports/attachement.repository.interface';

@Module({
  controllers: [UploadAttachmentController],
  providers: [
    { provide: IAttachmentStorage, useClass: CloudinaryAttachmentAdapter },
    CloudinaryProvider,
  ],
})
export class AttachmentManagementModule {}
