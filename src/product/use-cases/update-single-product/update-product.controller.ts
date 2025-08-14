import { Inject, NotFoundException } from '@nestjs/common';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { UpdateProductRequest } from './update-product.dto';

export class UpdateProduct {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepository,
  ) {}

  async execute(request: UpdateProductRequest): Promise<void> {
    const product = await this.productRepository.findById(request.id);
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

    await this.productRepository.save(product);
  }
}
