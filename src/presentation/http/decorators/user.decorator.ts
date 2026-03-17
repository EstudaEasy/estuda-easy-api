import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import { AuthenticatedUser } from '@adapters/auth/types/auth-user.type';

export const User = createParamDecorator((data: keyof AuthenticatedUser, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user = request.user as AuthenticatedUser;
  return data ? user[data] : user;
});
