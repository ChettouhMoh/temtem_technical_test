// test/get-all-products.e2e-spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { GetAllProducts } from '@product/use-cases/get-all-products/get-all-products.controller';
import { Product } from '@product/domain/product';
import { createMock } from '@golevelup/ts-jest';

describe('Get All Products (e2e)', () => {
  let app: INestApplication;
  let productRepository: jest.Mocked<IProductRepository>;

  beforeAll(async () => {
    const mockProductRepository: jest.Mocked<IProductRepository> =
      createMock<IProductRepository>();

    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [GetAllProducts],
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

  it('/products (GET) should return products with pagination defaults', async () => {
    const products = [
      Product.createNew({
        name: 'Phone',
        description: 'Smartphone',
        price: 699,
        category: 'Electronics',
        image: 'https://example.com/phone.jpg',
      }),
      Product.createNew({
        name: 'Laptop',
        description: 'Gaming laptop',
        price: 1299,
        category: 'Electronics',
        image: 'https://example.com/laptop.jpg',
      }),
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
    expect(response.body.items).toHaveLength(2);
    expect(response.body.items[0].name).toBe('Phone');
    expect(response.body.items[1].name).toBe('Laptop');
  });

  it('/products (GET) should respect query params', async () => {
    const products = [
      Product.createNew({
        name: 'TV',
        description: '4K OLED TV',
        price: 1500,
        category: 'Electronics',
        image: 'https://example.com/tv.jpg',
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
});
