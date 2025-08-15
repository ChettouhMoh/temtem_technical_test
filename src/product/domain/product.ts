import { UUID } from 'crypto';

interface ProductProps {
  name: string;
  description: ProductDescription;
  price: Price;
  category: string;
  image: string;
}

interface ProductPayload {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

class ProductDescription {
  private readonly _value: string;

  constructor(value: string) {
    if (value.length < 100 && value.length > 600) {
      throw new Error(
        'Description must be between 100 and 600 characters long',
      );
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}

class Price {
  private readonly _value: number;
  constructor(value: number) {
    if (value <= 0) {
      throw new Error('Price must be greater than zero');
    }
    this._value = value;
  }

  get value(): number {
    return this._value;
  }
}

export class Product {
  private readonly _id: UUID;
  private props: ProductProps;

  private constructor(props: ProductProps, id?: UUID) {
    this._id = id ?? (crypto.randomUUID() as UUID);
    this.props = props;
  }

  public static restoreExisting(props: ProductPayload, id: UUID): Product {
    return new Product(
      {
        name: props.name,
        description: new ProductDescription(props.description),
        price: new Price(props.price),
        category: props.category,
        image: props.image,
      },
      id,
    );
  }

  public static createNew(props: ProductPayload): Product {
    return new Product({
      name: props.name,
      description: new ProductDescription(props.description),
      price: new Price(props.price),
      category: props.category,
      image: props.image,
    });
  }

  // --- Domain behaviors (update methods) ---
  public updateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    this.props.name = name;
  }

  public updateDescription(description: string) {
    this.props.description = new ProductDescription(description);
  }

  public updatePrice(price: number) {
    this.props.price = new Price(price);
  }

  public updateCategory(category: string) {
    this.props.category = category;
  }

  public updateImage(image: string) {
    this.props.image = image;
  }

  // Getters
  get id(): UUID {
    return this._id;
  }

  get name(): string {
    return this.props.name;
  }

  get description(): string {
    return this.props.description.value;
  }

  get price(): number {
    return this.props.price.value;
  }

  get category(): string {
    return this.props.category;
  }

  get image(): string {
    return this.props.image;
  }
}
