import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiBearerAuth } from '@nestjs/swagger';

import { UserRole } from '@domain/entities/user/user.interface';

import { UserAccessTokenGuard } from '../guards/users/user-access.guard';

export const USER_ROLES_KEY = 'user-roles';

export function Auth(...roles: UserRole[]) {
  return applyDecorators(UseGuards(UserAccessTokenGuard), SetMetadata(USER_ROLES_KEY, roles), ApiBearerAuth());
}
