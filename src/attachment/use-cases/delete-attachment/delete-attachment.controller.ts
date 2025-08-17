import {
  Controller,
  Inject,
  Delete,
  Param,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
} from '@nestjs/swagger';
import { IAttachmentStorage } from '@attachment/ports/attachement.repository.interface';
import { Role } from '@auth/domain/user-context';
import { RequireRoles } from '@auth/infra/decorators/decorators';

@ApiTags('Attachments')
@Controller('attachment')
export class DeleteAttachmentController {
  constructor(
    @Inject(IAttachmentStorage) private readonly storage: IAttachmentStorage,
  ) {}

  @Delete(':key')
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete an attachment by its key' })
  @ApiParam({ name: 'key', description: 'The key of the attachment to delete', example: 'folder/image.png'})
  @ApiResponse({ status: 204, description: 'Attachment deleted successfully' })
  @ApiResponse({ status: 404, description: 'Attachment not found' })
  @RequireRoles(Role.Owner)
  async execute(@Param('key') key: string): Promise<void> {
    await this.storage.delete(key);
  }
}
