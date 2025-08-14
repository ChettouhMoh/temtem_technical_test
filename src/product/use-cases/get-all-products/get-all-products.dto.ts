import { Product } from '@product/domain/product';

interface ProductItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
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
    }));
    return response;
  }
}
