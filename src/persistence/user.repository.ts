import { User } from '@auth/domain/user';
import { Role } from '@auth/domain/user-context';
import { IUserRepository } from '@auth/ports/user.repository.interface';
import { randomUUID } from 'crypto';

export class UserRepositoryInMemory implements IUserRepository {
  private users: Map<string, User> = new Map();

  constructor() {
    const adminUser = User.restoreExisting(
      {
        username: 'Admin',
        email: 'admin@temtem.com',
        passwordHash:
          '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // password
        role: Role.Owner,
      },
      randomUUID(),
    );
    this.users.set(adminUser.id, adminUser);

    const guestUser = User.restoreExisting(
      {
        username: 'Guest',
        email: 'guest@temtem.com',
        passwordHash:
          '5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8', // password
        role: Role.Guest,
      },
      randomUUID(),
    );
    this.users.set(guestUser.id, guestUser);
  }

  async save(user: User): Promise<void> {
    this.users.set(user.id, user);
  }

  findByEmail(email: string): Promise<User | null> {
    const user = Array.from(this.users.values()).find((u) => u.email === email);
    return Promise.resolve(user || null);
  }
}
