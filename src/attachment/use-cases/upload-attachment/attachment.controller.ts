// src/attachment-management/use-cases/upload-attachment/upload-attachment.controller.ts
import {
  BadRequestException,
  Body,
  Controller,
  Inject,
  Post,
  UploadedFile,
  UseInterceptors,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { UploadAttachmentResponse } from './upload-attachment.dto';
import { IAttachmentStorage } from '@attachment/ports/attachement.repository.interface';
import { Role } from '@auth/domain/user-context';
import { RequireRoles } from '@auth/infra/decorators/decorators';

class UploadAttachmentBodyDto {
  // Optional folder/namespace at provider side
  folder?: string;
}

@ApiTags('Attachments')
@Controller('attachment')
export class UploadAttachmentController {
  constructor(
    @Inject(IAttachmentStorage) private readonly storage: IAttachmentStorage,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Upload an attachment and get its public URL' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        folder: { type: 'string', example: 'products' },
      },
      required: ['file'],
    },
  })
  @ApiResponse({
    status: 201,
    description: 'Uploaded',
    type: UploadAttachmentResponse,
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
    }),
  )
  @RequireRoles(Role.Owner)
  async execute(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 }),
          // images + PDFs by default; tweak as needed
          new FileTypeValidator({
            fileType: /(image\/(png|jpeg|gif|webp)|application\/pdf)$/,
          }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Body() body: UploadAttachmentBodyDto,
  ): Promise<UploadAttachmentResponse> {
    if (!file) throw new BadRequestException('File is required');

    const uploaded = await this.storage.upload({
      buffer: file.buffer,
      filename: file.originalname,
      mimeType: file.mimetype,
      folder: body?.folder || 'attachments',
    });

    return { url: uploaded.url, key: uploaded.key };
  }
}
