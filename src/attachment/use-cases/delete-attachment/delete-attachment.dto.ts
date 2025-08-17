import { ApiProperty } from '@nestjs/swagger';

export class DeleteAttachmentDto {
  @ApiProperty({
    description: 'The key of the attachment to delete',
    example: 'attachments/some-key',
  })
  key: string;
}
