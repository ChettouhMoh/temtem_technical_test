import { User } from '../domain/user';

export interface IUserRepository {
  save(user: User): Promise<void>;
}

export const IUserRepository = Symbol('IUserRepository');
