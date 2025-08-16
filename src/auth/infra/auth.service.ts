import { UserContext } from '@auth/domain/user-context';

export class AuthServiceProvider {
  getUserContextFromHeaders(
    headers: Record<string, string>,
  ): Promise<UserContext> {
    // Simulate fetching user context from headers
    const cookie = headers['cookie'];
    if (!cookie) {
      throw new Error('Cookie not found in headers');
    }
    const userIdMatch = cookie.match(/userId=([^;]+)/);
    const roleMatch = cookie.match(/role=([^;]+)/);
    if (!userIdMatch || !roleMatch) {
      throw new Error('Invalid cookie format');
    }
    const userId = userIdMatch[1];
    const role = roleMatch[1];
    return Promise.resolve(new UserContext(userId, role));
  }
}
