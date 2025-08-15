import { Product } from '../domain/product';
type SortOrder = 'asc' | 'desc';

export interface IProductRepository {
  create(product: Product): Promise<void>;

  getAll(
    page: number,
    limit: number,
    category: string,
    sortOrder: SortOrder,
  ): Promise<Product[]>;

  findById(id: string): Promise<Product | null>;

  update(id: string, product: Partial<Product>): Promise<void>;
}

export const IProductRepository = Symbol('IProductRepository');
