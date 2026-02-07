import { Inject, Injectable } from '@nestjs/common';

import { Exception, ResourceErrorCodes } from '@application/errors';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/repositories/resource/resource.repository';
import { In } from '@shared/utils/filter-operators.util';

@Injectable()
export class ResourcePermissionService {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository
  ) {}

  async verifyOrThrow(resourceId: string, userId: number, permissions: SharePermission[]): Promise<void> {
    const hasPermission = await this.resourceRepository.findOne([
      {
        // Owner permission
        id: resourceId,
        userId
      },
      {
        // Shared permission
        id: resourceId,
        shares: { userId, permission: In(permissions) }
      }
    ]);

    if (!hasPermission) {
      throw new Exception(ResourceErrorCodes.INSUFFICIENT_PERMISSIONS);
    }
  }
}
