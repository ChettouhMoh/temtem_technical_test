import { IProductRepository } from '../../ports/product.repository.interface';
import { CreateProductDto } from './create-product.dto';
import { Product } from '../../domain/product';
import { Controller, Inject, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBody } from '@nestjs/swagger';
import { RequireRoles } from '@auth/infra/decorators/decorators';
import { UserRolesGuard } from '@auth/infra/guards/role.guard';
import { Role } from '@auth/domain/user-context';

@ApiTags('Products') // Groups all endpoints under "Products"
@Controller('products')
export class CreateProduct {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new product' }) // Short description
  @ApiResponse({ status: 201, description: 'Product successfully created' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiBody({ type: CreateProductDto }) // Shows DTO schema in Swagger
  @RequireRoles(Role.Owner)
  @UseGuards(UserRolesGuard)
  async execute(@Body() createProductDto: CreateProductDto): Promise<void> {
    const product = Product.createNew({
      name: createProductDto.name,
      description: createProductDto.description,
      price: createProductDto.price,
      category: createProductDto.category,
      image: createProductDto.image,
      imageKey: createProductDto.imageKey,
    });

    this.productRepository.create(product);
  }
}
