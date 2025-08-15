import * as bcrypt from 'crypto';

interface UserProps {
  username: Username;
  email: Email;
  passwordHash: PasswordHash;
}

interface UserPayload {
  username: string;
  email: string;
  passwordHash: string;
}

class PasswordHash {
  private readonly _value: string;

  constructor(value: string) {
    this._value = value;
  }

  public static fromPlainText(plainText: string): PasswordHash {
    const hash = bcrypt.createHash('sha256').update(plainText).digest('hex');
    return new PasswordHash(hash);
  }

  public static fromHash(hash: string): PasswordHash {
    return new PasswordHash(hash);
  }

  get value(): string {
    return this._value;
  }
}

class Username {
  private readonly _value: string;

  constructor(value: string) {
    if (value.length < 3 || value.length > 20) {
      throw new Error('Username must be between 3 and 20 characters long');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}

class Email {
  private readonly _value: string;

  constructor(value: string) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      throw new Error('Invalid email format');
    }
    this._value = value;
  }

  get value(): string {
    return this._value;
  }
}

export class User {
  private readonly _id: string;
  private props: UserProps;

  private constructor(props: UserProps, id?: string) {
    this._id = id ?? crypto.randomUUID();
    this.props = props;
  }

  public static restoreExisting(props: UserPayload, id: string): User {
    return new User(
      {
        username: new Username(props.username),
        email: new Email(props.email),
        passwordHash: PasswordHash.fromHash(props.passwordHash),
      },
      id,
    );
  }
  public static createNew(props: {
    username: string;
    email: string;
    password: string;
  }): User {
    return new User({
      username: new Username(props.username),
      email: new Email(props.email),
      passwordHash: PasswordHash.fromPlainText(props.password),
    });
  }

  get id(): string {
    return this._id;
  }

  get username(): string {
    return this.props.username.value;
  }

  get email(): string {
    return this.props.email.value;
  }
}
