import { Inject, Injectable } from '@nestjs/common';
import { CLOUDINARY } from './cloudinary.provider';
import type { v2 as CloudinaryNS } from 'cloudinary';
import { randomUUID } from 'crypto';
import {
  IAttachmentStorage,
  UploadResult,
} from '@attachment/ports/attachement.repository.interface';

@Injectable()
export class CloudinaryAttachmentAdapter implements IAttachmentStorage {
  constructor(
    @Inject(CLOUDINARY) private readonly cloudinary: typeof CloudinaryNS,
  ) {}

  async upload(input: {
    buffer: Buffer;
    filename: string;
    mimeType: string;
    folder?: string;
  }): Promise<UploadResult> {
    const { buffer, filename, folder } = input;

    const publicIdBase =
      filename?.split('.').slice(0, -1).join('.') || randomUUID();

    const result = await new Promise<{
      secure_url: string;
      public_id: string;
      bytes: number;
    }>((resolve, reject) => {
      const upload = this.cloudinary.uploader.upload_stream(
        {
          folder,
          public_id: publicIdBase,
          resource_type: 'auto',
        },
        (error, res) => (error ? reject(error) : resolve(res as any)),
      );
      upload.end(buffer);
    });

    return {
      url: result.secure_url,
      key: result.public_id,
    };
  }
}
