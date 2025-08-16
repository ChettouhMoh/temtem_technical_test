import {
  Controller,
  DefaultValuePipe,
  Get,
  Inject,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { Product } from '@product/domain/product';
import {
  GetAllProductsRequest,
  GetAllProductsResponse,
} from './get-all-products.dto';
import { RequireRoles } from '@auth/infra/decorators/decorators';
import { Role } from '@auth/domain/user-context';

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
  @RequireRoles(Role.Owner, Role.Guest)
  async execute(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('category') category?: string,
    @Query('sortOrder') sortOrder?: 'asc' | 'desc',
  ): Promise<GetAllProductsResponse> {
    const items = await this.productRepository.getAll(
      page,
      limit,
      category,
      sortOrder,
    );
    return GetAllProductsResponse.from(items);
  }
}
