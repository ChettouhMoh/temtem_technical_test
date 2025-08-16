import { Injectable, NotFoundException } from '@nestjs/common';
import { mock_Product } from '@product/domain/product.mock';
import { Product } from 'src/product/domain/product';
import { IProductRepository } from 'src/product/ports/product.repository.interface';

@Injectable()
export class ProductRepositoryInMemory implements IProductRepository {
  private products: Product[] = [
    mock_Product({
      price: 100,
      category: 'Electronics',
    }),
    mock_Product({
      price: 150,
      category: 'Books',
    }),
    mock_Product({
      price: 120,
      category: 'Electronics',
    }),
    mock_Product({
      price: 300,
      category: 'Books',
    }),
  ];

  create(product: Product): Promise<void> {
    // removed the old logic, now this function is only responsible for saving a new product
    // no upsert logic
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

  findById(id: string): Promise<Product | null> {
    const product = this.products.find((product) => product.id === id);
    return Promise.resolve(product || null);
  }

  update(id: string, product: Partial<Product>): Promise<void> {
    const existingProductIndex = this.products.findIndex((p) => p.id === id);
    const existingProduct = this.products[existingProductIndex];
    const updatedProduct = Object.assign(existingProduct, product);
    this.products[existingProductIndex] = updatedProduct;

    return Promise.resolve();
  }

  delete(id: string): Promise<void> {
    const productIndex = this.products.findIndex((p) => p.id === id);
    if (productIndex === -1) {
      return Promise.reject(new Error('Product not found'));
    }
    this.products.splice(productIndex, 1);
    return Promise.resolve();
  }
}
