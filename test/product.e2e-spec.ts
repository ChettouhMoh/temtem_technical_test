// test/products.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, BadRequestException } from '@nestjs/common';
import * as request from 'supertest';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { GetAllProducts } from '@product/use-cases/get-all-products/get-all-products.controller';
import { DeleteProduct } from '@product/use-cases/delete-product/delete-product.controller';
import { Product } from '@product/domain/product';
import { createMock } from '@golevelup/ts-jest';
import { mock_Product } from '@product/domain/product.mock';

describe('Products (e2e)', () => {
  let app: INestApplication;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeAll(async () => {
    const mockProductRepository: jest.Mocked<IProductRepository> =
      createMock<IProductRepository>();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GetAllProducts, DeleteProduct],
      providers: [
        {
          provide: IProductRepository,
          useValue: mockProductRepository,
        },
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    productRepository = moduleFixture.get(IProductRepository);
  });

  afterAll(async () => {
    await app.close();
  });

  // -------------------- GET /products --------------------
  it('/products (GET) should return products with pagination defaults', async () => {
    const products = [
      mock_Product(),
      mock_Product({ name: 'Phone', price: 699 }),
      mock_Product({ name: 'Phone', price: 322 }),
      mock_Product({ name: 'Laptop', price: 322 }),
    ];

    productRepository.getAll.mockResolvedValue(products);

    const response = await request(app.getHttpServer())
      .get('/products')
      .expect(200);

    expect(productRepository.getAll).toHaveBeenCalledWith(
      1,
      10,
      undefined,
      undefined,
    );
    expect(response.body.items).toHaveLength(4);
  });

  it('/products (GET) should respect query params', async () => {
    const products = [
      Product.createNew({
        name: 'TV',
        description: '4K OLED TV',
        price: 1500,
        category: 'Electronics',
        image: 'https://example.com/tv.jpg',
        imageKey: 'products/imageKey',
      }),
    ];

    productRepository.getAll.mockResolvedValue(products);

    const response = await request(app.getHttpServer())
      .get('/products')
      .query({ page: 2, limit: 5, category: 'Electronics', sortOrder: 'asc' })
      .expect(200);

    expect(productRepository.getAll).toHaveBeenCalledWith(
      2,
      5,
      'Electronics',
      'asc',
    );
    expect(response.body.items).toHaveLength(1);
    expect(response.body.items[0].name).toBe('TV');
  });

  // -------------------- DELETE /products/:id --------------------
  it('/products/:id (DELETE) should delete a product successfully', async () => {
    const productId = '123';

    productRepository.delete.mockResolvedValue();

    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(200);

    expect(productRepository.delete).toHaveBeenCalledWith(productId);
  });

  it('/products/:id (DELETE) should propagate repository errors', async () => {
    const productId = '456';
    const error = new Error('Database error');

    productRepository.delete.mockRejectedValue(error);

    await request(app.getHttpServer())
      .delete(`/products/${productId}`)
      .expect(404);

    expect(productRepository.delete).toHaveBeenCalledWith(productId);
  });
});
