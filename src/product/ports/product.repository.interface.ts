import { Product } from '../domain/product';

export interface IProductRepository {
  save(product: Product): Promise<void>;
  getAll(): Promise<Product[]>;
}

export const IProductRepository = Symbol('IProductRepository');
