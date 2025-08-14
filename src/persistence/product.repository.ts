import { Injectable } from '@nestjs/common';
import { Product } from 'src/product/domain/product';
import { IProductRepository } from 'src/product/ports/product.repository.interface';

@Injectable()
export class ProductRepositoryInMemory implements IProductRepository {
  private products: Product[] = [];

  save(product: Product): Promise<void> {
    this.products.push(product);
    return Promise.resolve();
  }

  getAll(): Promise<Product[]> {
    return Promise.resolve(this.products);
  }
}
