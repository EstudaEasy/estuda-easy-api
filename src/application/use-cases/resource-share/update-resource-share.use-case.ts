import { Inject, Injectable } from '@nestjs/common';

import { Exception, ResourceShareErrorCodes } from '@application/errors';
import { ResourceShareEntity } from '@domain/entities/resource-share/resource-share.entity';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import {
  RESOURCE_SHARE_REPOSITORY_TOKEN,
  IResourceShareRepository
} from '@domain/repositories/resource-share/resource-share.repository';

type UpdateResourceShareInput = {
  shareId: number;
  userId: number;
  permission: SharePermission;
};

@Injectable()
export class UpdateResourceShareUseCase {
  constructor(
    @Inject(RESOURCE_SHARE_REPOSITORY_TOKEN)
    private readonly resourceShareRepository: IResourceShareRepository
  ) {}

  async execute(input: UpdateResourceShareInput): Promise<ResourceShareEntity> {
    const { shareId, userId, permission } = input;

    const existingResourceShare = await this.resourceShareRepository.findOne({ id: shareId }, { resource: true });
    if (!existingResourceShare) {
      throw new Exception(ResourceShareErrorCodes.NOT_FOUND);
    }

    if (existingResourceShare.resource?.userId !== userId) {
      throw new Exception(ResourceShareErrorCodes.NOT_OWNER);
    }

    const updatedResourceShare = await this.resourceShareRepository.update({ id: shareId }, { permission });
    if (!updatedResourceShare) {
      throw new Exception(ResourceShareErrorCodes.NOT_UPDATED);
    }

    return new ResourceShareEntity(updatedResourceShare);
  }
}
