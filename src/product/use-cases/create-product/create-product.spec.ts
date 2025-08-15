import { TestingModule, Test } from '@nestjs/testing';
import { CreateProduct } from './create-product.controller';
import { CreateProductDto } from './create-product.dto';
import { Product } from '../../domain/product';
import { IProductRepository } from '../../ports/product.repository.interface';
import { createMock } from '@golevelup/ts-jest';

describe('CreateProduct Controller', () => {
  let controller: CreateProduct;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeEach(async () => {
    const mockProductRepository: jest.Mocked<IProductRepository> =
      createMock<IProductRepository>();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [CreateProduct],
      providers: [
        {
          provide: IProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    controller = module.get<CreateProduct>(CreateProduct);
    productRepository = module.get(IProductRepository);
  });

  it('should save a new product', async () => {
    const dto: CreateProductDto = {
      name: 'Test Product',
      description: 'A product for testing',
      price: 10,
      category: 'Testing',
      image: 'https://example.com/test.jpg',
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
