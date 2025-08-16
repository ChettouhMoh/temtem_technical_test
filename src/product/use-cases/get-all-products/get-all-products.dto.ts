import { Product } from '@product/domain/product';

// Request DTO
export class GetAllProductsRequest {
  page: number;
  limit: number;
  category?: string;
  sortOrder?: 'asc' | 'desc';
}

// Response DTO
interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  imageKey: string;
}

export class GetAllProductsResponse {
  items: ProductItem[];

  public static from(items: Product[]) {
    const response = new GetAllProductsResponse();
    response.items = items.map((item) => ({
      id: item.id,
      name: item.name,
      description: item.description,
      price: item.price,
      category: item.category,
      image: item.image,
      imageKey: item.imageKey,
    }));
    return response;
  }
}
