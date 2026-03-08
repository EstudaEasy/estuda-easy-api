import { Inject, Injectable } from '@nestjs/common';

import { Exception, ResourceErrorCodes } from '@application/errors';
import { ResourceType } from '@domain/resource/resource.interface';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { SharePermission } from '@domain/resource-share/resource-share.interface';
import { In } from '@shared/utils';

@Injectable()
export class ResourcePermissionService {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository
  ) {}

  async verifyOrThrow(entityId: string, userId: number, type: ResourceType, permissions?: SharePermission[]) {
    const resource = await this.resourceRepository.findOne({
      [type]: { id: entityId }
    });

    if (resource) {
      if (resource.userId === userId) {
        return;
      }

      const hasPermission = await this.resourceRepository.findOne({
        id: resource.id,
        shares: {
          userId,
          permission: permissions?.length ? In(permissions) : undefined
        }
      });

      if (!hasPermission) {
        throw new Exception(ResourceErrorCodes.INSUFFICIENT_PERMISSIONS);
      }
    }
  }
}
