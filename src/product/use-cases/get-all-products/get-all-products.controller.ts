import { Controller, Get, Inject, Query } from '@nestjs/common';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Product } from '@product/domain/product';
import {
  GetAllProductsRequest,
  GetAllProductsResponse,
} from './get-all-products.dto';

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
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number for pagination',
    type: Number,
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of products per page',
    type: Number,
    example: 10,
  })
  @ApiQuery({
    name: 'category',
    required: false,
    description: 'Filter products by category',
    type: String,
    example: 'Electronics',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Sort order of products',
    type: String,
    enum: ['asc', 'desc'],
    example: 'asc',
  })
  async execute(
    @Query() query: GetAllProductsRequest = { page: 1, limit: 10 },
  ): Promise<GetAllProductsResponse> {
    const items = await this.productRepository.getAll(
      query.page,
      query.limit,
      query.category,
      query.sortOrder,
    );
    return GetAllProductsResponse.from(items);
  }
}
