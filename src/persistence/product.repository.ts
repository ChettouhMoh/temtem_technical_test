import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { Product } from 'src/product/domain/product';
import { IProductRepository } from 'src/product/ports/product.repository.interface';

@Injectable()
export class ProductRepositoryInMemory implements IProductRepository {
  private products: Product[] = [
    Product.restoreExisting(
      {
        name: 'Sample Product',
        description: 'This is a sample product',
        price: 100,
        category: 'Electronics',
        image: 'https://example.com/sample-product.jpg',
      },
      randomUUID(),
    ),
    Product.restoreExisting(
      {
        name: 'Sample Product 2',
        description: 'This is a sample product',
        price: 120,
        category: 'Books',
        image: 'https://example.com/sample-product.jpg',
      },
      randomUUID(),
    ),
    Product.restoreExisting(
      {
        name: 'Sample Product 3',
        description: 'This is a sample product',
        price: 80,
        category: 'Clothes',
        image: 'https://example.com/sample-product.jpg',
      },
      randomUUID(),
    ),
    Product.restoreExisting(
      {
        name: 'Sample Product 4',
        description: 'This is a sample product',
        price: 60,
        category: 'Books',
        image: 'https://example.com/sample-product.jpg',
      },
      randomUUID(),
    ),
  ];

  save(product: Product): Promise<void> {
    this.products.push(product);
    return Promise.resolve();
  }

  getAll(
    page: number = 1,
    limit: number = 10,
    category?: string,
    sortOrder: 'asc' | 'desc' = 'asc',
  ): Promise<Product[]> {
    let filteredProducts = this.products;

    // Filter products by category if provided
    if (category) {
      filteredProducts = filteredProducts.filter(
        (product) => product.category === category,
      );
    }

    //sort products by price
    filteredProducts.sort((a, b) => {
      if (sortOrder === 'asc') {
        return a.price - b.price;
      } else {
        return b.price - a.price;
      }
    });

    // Pagination logic
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    return Promise.resolve(filteredProducts.slice(startIndex, endIndex));
  }
}
