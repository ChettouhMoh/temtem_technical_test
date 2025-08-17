import { CreateProduct } from './create-product.controller';
import { CreateProductDto } from './create-product.dto';
import { Product } from '../../domain/product';
import { IProductRepository } from '../../ports/product.repository.interface';

describe('CreateProduct Controller (pure unit)', () => {
  let controller: CreateProduct;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(() => {
    // create a manual mock of the repository
    productRepository = {
      create: jest.fn(),
    } as unknown as jest.Mocked<IProductRepository>;

    // instantiate the controller directly
    controller = new CreateProduct(productRepository);
  });

  it('should save a new product', async () => {
    const dto: CreateProductDto = {
      name: 'Test Product',
      description: 'A product for testing',
      price: 10,
      category: 'Testing',
      image: 'https://example.com/test.jpg',
      imageKey: 'products/image',
    };

    await controller.execute(dto);

    expect(productRepository.create).toHaveBeenCalledTimes(1);

    // Check that the saved product is a Product instance with correct values
    const savedProduct = productRepository.create.mock.calls[0][0];
    expect(savedProduct).toBeInstanceOf(Product);
    expect(savedProduct.name).toBe(dto.name);
    expect(savedProduct.price).toBe(dto.price);
  });
});
