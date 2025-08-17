import { NotFoundException } from '@nestjs/common';
import { UpdateProduct } from './update-product.controller';
import { Product } from '@product/domain/product';
import { IProductRepository } from '@product/ports/product.repository.interface';

// helper to create a product with default props
const makeProduct = () =>
  Product.restoreExisting(
    {
      name: 'Old Name',
      description: 'Old Description',
      price: 100,
      category: 'Old Category',
      image: 'old.png',
      imageKey: 'products/imageKey',
    },
    'uuid-1234' as any,
  );

describe('UpdateProduct (pure unit)', () => {
  let controller: UpdateProduct;
  let productRepository: jest.Mocked<IProductRepository>;
  let existingProduct: Product;

  beforeEach(() => {
    productRepository = {
      findById: jest.fn(),
      update: jest.fn(),
      // other methods of repo are irrelevant here
    } as unknown as jest.Mocked<IProductRepository>;

    controller = new UpdateProduct(productRepository);
    existingProduct = makeProduct();
  });

  it('throws NotFoundException if product not found', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(
      controller.execute('uuid-1234', { name: 'New Name' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('updates product name and calls repository.update', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await controller.execute(existingProduct.id, { name: 'New Name' });

    expect(existingProduct.name).toBe('New Name');
    expect(productRepository.update).toHaveBeenCalledWith(
      existingProduct.id,
      existingProduct,
    );
  });

  it('updates multiple fields', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await controller.execute(existingProduct.id, {
      name: 'New Name',
      description: 'New Description',
      price: 200,
      category: 'New Category',
      image: 'new.png',
    });

    expect(existingProduct.name).toBe('New Name');
    expect(existingProduct.description).toBe('New Description');
    expect(existingProduct.price).toBe(200);
    expect(existingProduct.category).toBe('New Category');
    expect(existingProduct.image).toBe('new.png');
    expect(productRepository.update).toHaveBeenCalledWith(
      existingProduct.id,
      existingProduct,
    );
  });

  it('throws error for invalid price', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await expect(
      controller.execute(existingProduct.id, { price: -10 }),
    ).rejects.toThrow('Price must be greater than zero');
  });

  it('throws error for empty name', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await expect(
      controller.execute(existingProduct.id, { name: '' }),
    ).rejects.toThrow('Product name cannot be empty');
  });
});
