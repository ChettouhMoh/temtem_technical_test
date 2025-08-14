import { UUID } from 'crypto';

interface ProductProps {
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export class Product {
  private readonly _id: UUID;
  private props: ProductProps;

  private constructor(props: ProductProps, id?: UUID) {
    this._id = id ?? (crypto.randomUUID() as UUID);
    this.props = props;
  }

  public static restoreExisting(props: ProductProps, id: UUID): Product {
    return new Product(props, id);
  }

  public static createNew(props: ProductProps): Product {
    return new Product(props);
  }

  // --- Domain behaviors (update methods) ---
  public updateName(name: string) {
    if (!name || name.trim().length === 0) {
      throw new Error('Product name cannot be empty');
    }
    this.props.name = name;
  }

  public updateDescription(description: string) {
    this.props.description = description;
  }

  public updatePrice(price: number) {
    if (price <= 0) {
      throw new Error('Price must be greater than zero');
    }
    this.props.price = price;
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
    return this.props.description;
  }

  get price(): number {
    return this.props.price;
  }

  get category(): string {
    return this.props.category;
  }

  get image(): string {
    return this.props.image;
  }
}
