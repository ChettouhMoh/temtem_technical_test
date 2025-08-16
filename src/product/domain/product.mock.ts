import { faker } from '@faker-js/faker';
import { Product, ProductPayload } from './product';
import { UUID } from 'crypto';

export function mock_Product(
  overrides: Partial<ProductPayload & { id: UUID }> = {},
) {
  return Product.restoreExisting(
    {
      name: overrides.name || faker.commerce.productName(),
      description:
        overrides.description ||
        faker.lorem.paragraphs(2, '\n\n').replace(/\n/g, ' '),
      price: overrides.price || parseFloat(faker.commerce.price()),
      category: overrides.category || faker.commerce.department(),
      image: overrides.image || faker.image.url(),
      imageKey: overrides.imageKey || faker.string.uuid(),
    },
    overrides.id || (faker.string.uuid() as UUID),
  );
}
