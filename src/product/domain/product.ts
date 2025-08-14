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

  public get product(): ProductProps {
    return { ...this.props };
  }

  public static restoreExisting(props: ProductProps, id: UUID): Product {
    return new Product(props, id);
  }

  public static createNew(props: ProductProps): Product {
    return new Product(props);
  }
}
