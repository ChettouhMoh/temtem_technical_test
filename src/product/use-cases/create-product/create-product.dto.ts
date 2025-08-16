import { ApiProperty } from '@nestjs/swagger';

export class CreateProductDto {
  @ApiProperty({
    description: 'The name of the product',
    example: 'Wireless Mouse',
  })
  name: string;

  @ApiProperty({
    description: 'A detailed description of the product',
    example: 'A smooth and ergonomic wireless mouse with long battery life',
  })
  description: string;

  @ApiProperty({
    description: 'The price of the product in USD',
    example: 29.99,
  })
  price: number;

  @ApiProperty({
    description: 'The category the product belongs to',
    example: 'Electronics',
  })
  category: string;

  @ApiProperty({
    description: 'URL of the product image',
    example: 'https://example.com/images/mouse.jpg',
  })
  image: string;

  @ApiProperty({
    description: 'image key for updates',
    example: 'products/imageKey',
  })
  imageKey: string;
}
