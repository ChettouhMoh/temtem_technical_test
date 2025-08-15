import { User } from '@auth/domain/user';
import { IUserRepository } from '@auth/ports/user.repository.interface';

export class UserRepositoryInMemory implements IUserRepository {
  private users: Map<string, User> = new Map();

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find((u) => u.email === email);
    return Promise.resolve(user || null);
  }
}
