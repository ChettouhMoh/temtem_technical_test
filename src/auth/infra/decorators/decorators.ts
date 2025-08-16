import { UserContext, Role } from '@auth/domain/user-context';
import {
  createParamDecorator,
  ExecutionContext,
  SetMetadata,
  UnauthorizedException,
} from '@nestjs/common';

/**
 * ## Current User
 * Route parameter decorator to extract the current user from the request.
 */
export const CurrentUser = createParamDecorator(
  async (_: unknown, ctx: ExecutionContext): Promise<UserContext> => {
    const request = ctx.switchToHttp().getRequest();
    if (!request.userContext) {
      throw new UnauthorizedException('UserContext not found in request');
    }
    return request.userContext;
  },
);

/**
 * ## Require Roles
 * Route decorator to require specific roles for a route.
 * example:
 * ```typescript
 * @RequireRoles(Role.Admin)
 * ```
 */
export const RequireRoles = (...roles: Role[]) => SetMetadata('roles', roles);
