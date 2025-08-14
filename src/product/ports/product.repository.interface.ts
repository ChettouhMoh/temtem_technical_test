import { Product } from '../domain/product';

export interface IProductRepository {
  save(product: Product): Promise<void>;
}

export const IProductRepository = Symbol('IProductRepository');
