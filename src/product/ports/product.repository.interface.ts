import { Product } from '../domain/product';
type SortOrder = 'asc' | 'desc';

export interface IProductRepository {
  save(product: Product): Promise<void>;

  getAll(
    page: number,
    limit: number,
    category: string,
    sortOrder: SortOrder,
  ): Promise<Product[]>;

  findById(id: string): Promise<Product | null>;
}

export const IProductRepository = Symbol('IProductRepository');
