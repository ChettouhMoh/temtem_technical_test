import { ApiPropertyOptional } from '@nestjs/swagger';

export class UploadAttachmentResponse {
  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/.../image/upload/v.../file.png',
  })
  url!: string;

  @ApiPropertyOptional({ example: 'attachments/abc123' })
  key!: string;
}
