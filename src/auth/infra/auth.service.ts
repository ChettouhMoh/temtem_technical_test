import { UserContext } from '@auth/domain/user-context';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';

export class AuthServiceProvider {
  getUserContextFromHeaders(
    headers: Record<string, string>,
  ): Promise<UserContext> {
    const cookie = headers['cookie'];
    if (!cookie) {
      throw new UnauthorizedException(
        'Authentication cookie not found. Please log in.',
      );
    }
    const userIdMatch = cookie.match(/userId=([^;]+)/);
    const roleMatch = cookie.match(/role=([^;]+)/);
    if (!userIdMatch || !roleMatch) {
      throw new BadRequestException('Invalid authentication cookie format.');
    }
    const userId = userIdMatch[1];
    const role = roleMatch[1];
    return Promise.resolve(new UserContext(userId, role));
  }
}
