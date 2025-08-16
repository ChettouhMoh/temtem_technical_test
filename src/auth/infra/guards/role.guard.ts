import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { AuthServiceProvider } from '../auth.service';
import { Role } from '@auth/domain/user-context';

@Injectable()
export class UserRolesGuard implements CanActivate {
  constructor(
    private readonly authService: AuthServiceProvider,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<true | never> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();

    const userContext = await this.authService.getUserContextFromHeaders(
      request.headers,
    );

    if (!userContext.hasAnyOfRoles(requiredRoles)) {
      throw new ForbiddenException(
        `User ${userContext.userId} does not have required roles`,
      );
    }

    request.userContext = userContext;

    return true;
  }
}
