import { NotFoundException } from '@nestjs/common';
import { IProductRepository } from '@product/ports/product.repository.interface';
import { Product } from '@product/domain/product';
import { UpdateProduct } from './update-product.controller';

// Utility for creating fake product props
const makeProductProps = () => ({
  name: 'Old Name',
  description: 'Old Description',
  price: 100,
  category: 'Old Category',
  image: 'old.png',
});

describe('UpdateProduct', () => {
  let updateProduct: UpdateProduct;
  let productRepository: jest.Mocked<IProductRepository>;
  let existingProduct: Product;

  beforeEach(() => {
    // mock repository
    productRepository = {
      findById: jest.fn(),
      save: jest.fn(),
      getAll: jest.fn(),
    };

    updateProduct = new UpdateProduct(productRepository);

    // create a real Product instance
    existingProduct = Product.restoreExisting(
      makeProductProps(),
      'uuid-1234' as any,
    );
  });

  it('should throw NotFoundException if product does not exist', async () => {
    productRepository.findById.mockResolvedValue(null);

    await expect(
      updateProduct.execute({ id: 'uuid-1234' as any, name: 'New Name' }),
    ).rejects.toThrow(NotFoundException);
  });

  it('should update product name and save', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await updateProduct.execute({ id: existingProduct.id, name: 'New Name' });

    expect(existingProduct.name).toBe('New Name');
    expect(productRepository.save).toHaveBeenCalledWith(existingProduct);
  });

  it('should update multiple fields', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await updateProduct.execute({
      id: existingProduct.id,
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
    expect(productRepository.save).toHaveBeenCalledWith(existingProduct);
  });

  it('should throw error when updating with invalid price', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await expect(
      updateProduct.execute({ id: existingProduct.id, price: -50 }),
    ).rejects.toThrow('Price must be greater than zero');
  });

  it('should throw error when updating with empty name', async () => {
    productRepository.findById.mockResolvedValue(existingProduct);

    await expect(
      updateProduct.execute({ id: existingProduct.id, name: '' }),
    ).rejects.toThrow('Product name cannot be empty');
  });
});
