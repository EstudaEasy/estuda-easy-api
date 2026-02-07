import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';

import { ResourcePermissionGuard } from '../guards/resource/resource-permission.guard';

export const RESOURCE_PERMISSION_KEY = 'resource_permission';

export interface ResourcePermissionMetadata {
  permissions: SharePermission[];
  param: string;
}

export function ResourcePermission(permissions: SharePermission[], param: string) {
  return applyDecorators(
    SetMetadata(RESOURCE_PERMISSION_KEY, { permissions, param }),
    UseGuards(ResourcePermissionGuard),
    ApiForbiddenResponse({ description: 'Permissões insuficientes para acessar o recurso' })
  );
}
