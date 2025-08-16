import { Role } from '@auth/domain/user-context';
import { RequireRoles } from '@auth/infra/decorators/decorators';
import {
  BadRequestException,
  Controller,
  Delete,
  Inject,
  NotFoundException,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { IProductRepository } from '@product/ports/product.repository.interface';

@ApiTags('Products')
@Controller('products')
export class DeleteProduct {
  constructor(
    @Inject(IProductRepository) private productRepository: IProductRepository,
  ) {}

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a product by ID' })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'The ID of the product to delete',
  })
  @RequireRoles(Role.Owner)
  async execute(@Param('id') id: string): Promise<void> {
    try {
      await this.productRepository.delete(id);
    } catch (error) {
      throw new NotFoundException(error.message || 'Product not found');
    }
  }
}
