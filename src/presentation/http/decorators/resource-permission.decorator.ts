import { applyDecorators, SetMetadata, UseGuards } from '@nestjs/common';
import { ApiForbiddenResponse } from '@nestjs/swagger';

import { ResourceType } from '@domain/resource/resource.interface';
import { SharePermission } from '@domain/resource-share/resource-share.interface';

import { ResourcePermissionGuard } from '../guards/resource/resource-permission.guard';

export const RESOURCE_PERMISSION_KEY = 'resource_permission';

export interface ResourcePermissionMetadata {
  param: string;
  type: `${ResourceType}`;
  permissions?: `${SharePermission}`[];
}

export function ResourcePermission(metadata: ResourcePermissionMetadata) {
  return applyDecorators(
    SetMetadata(RESOURCE_PERMISSION_KEY, metadata),
    UseGuards(ResourcePermissionGuard),
    ApiForbiddenResponse({ description: 'Permissões insuficientes para acessar o recurso' })
  );
}
