import { NotFoundException } from '@nestjs/common';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { Product } from '@product/domain/product';
import { UpdateProduct } from './update-product.controller';
import { createMock } from '@golevelup/ts-jest';

// Utility for creating fake product props
const makeProductProps = () => ({
  name: 'Old Name',
  description: 'Old Description',
  price: 100,
  category: 'Old Category',
  image: 'old.png',
  imageKey: 'products/imageKey',
});

describe('UpdateProduct', () => {
  let updateProduct: UpdateProduct;
  let productRepository: jest.Mocked<IProductRepository>;
  let existingProduct: Product;

  beforeEach(() => {
    productRepository = createMock<IProductRepository>();

    updateProduct = new UpdateProduct(productRepository);

    existingProduct = Product.restoreExisting(
      makeProductProps(),
      'uuid-1234' as any,
    );
  });

  it('should throw NotFoundException if product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(
      updateProduct.execute('uuid-1234', { name: 'New Name' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update product name and call repository.update with id + product', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await updateProduct.execute(existingProduct.id, { name: 'New Name' });

    expect(existingProduct.name).toBe('New Name');
    expect(productRepository.update).toHaveBeenCalledWith(
      existingProduct.id,
      existingProduct,
    );
  });

  it('should update multiple fields and call repository.update with id + product', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await updateProduct.execute(existingProduct.id, {
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

  it('should throw error when updating with invalid price', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await expect(
      updateProduct.execute(existingProduct.id, { price: -50 }),
    ).rejects.toThrow('Price must be greater than zero');
  });

  it('should throw error when updating with empty name', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await expect(
      updateProduct.execute(existingProduct.id, { name: '' }),
    ).rejects.toThrow('Product name cannot be empty');
  });
});
