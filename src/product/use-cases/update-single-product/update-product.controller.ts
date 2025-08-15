import {
  Body,
  Controller,
  Inject,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { UpdateProductRequest } from './update-product.dto';
import { ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class UpdateProduct {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  @Put(':id')
  @ApiOperation({ summary: 'Update a product by ID' })
  @ApiParam({ name: 'id', type: String, description: 'The ID of the product' })
  async execute(
    @Param('id') id: string,
    @Body() request: UpdateProductRequest,
  ): Promise<void> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (request.name !== undefined) {
      product.updateName(request.name);
    }
    if (request.description) {
      product.updateDescription(request.description);
    }
    if (request.price) {
      product.updatePrice(request.price);
    }
    if (request.category) {
      product.updateCategory(request.category);
    }
    if (request.image) {
      product.updateImage(request.image);
    }

    await this.productRepository.update(id, product);
  }
}
