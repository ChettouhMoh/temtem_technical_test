import { Controller, Get, Inject } from '@nestjs/common';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { Product } from '@product/domain/product';
import { GetAllProductsResponse } from './get-all-products.dto';

@ApiTags('Products')
@Controller('products')
export class GetAllProducts {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get all products' })
  @ApiResponse({
    status: 200,
    description: 'List of all products',
    type: Product,
    isArray: true,
  })
  async execute(): Promise<GetAllProductsResponse> {
    const items = await this.productRepository.getAll();
    return GetAllProductsResponse.from(items);
  }
}
