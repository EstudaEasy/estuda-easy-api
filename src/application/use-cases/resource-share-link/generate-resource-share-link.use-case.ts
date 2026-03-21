import { Inject, Injectable } from '@nestjs/common';

import { ResourceErrorCodes, ResourceShareLinkErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { SharePermission } from '@domain/resource-share/resource-share.interface';
import { ResourceShareLinkEntity } from '@domain/resource-share-link/resource-share-link.entity';
import {
  RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
  IResourceShareLinkRepository
} from '@domain/resource-share-link/resource-share-link.repository';

type GenerateResourceShareLinkInput = {
  resourceId: string;
  permission: SharePermission;
  userId: number;
};

@Injectable()
export class GenerateResourceShareLinkUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository,
    @Inject(RESOURCE_SHARE_LINK_REPOSITORY_TOKEN)
    private readonly resourceShareLinkRepository: IResourceShareLinkRepository
  ) {}

  async execute(input: GenerateResourceShareLinkInput): Promise<ResourceShareLinkEntity> {
    const { resourceId, permission, userId } = input;

    const resource = await this.resourceRepository.findOne({ id: resourceId });
    if (!resource) {
      throw new Exception(ResourceErrorCodes.NOT_FOUND);
    }

    if (resource.userId !== userId) {
      throw new Exception(ResourceShareLinkErrorCodes.INVALID_PERMISSION_TO_GENERATE);
    }

    const existingLink = await this.resourceShareLinkRepository.findOne({ resourceId });

    if (!existingLink) {
      const createdLink = await this.resourceShareLinkRepository.create({ resourceId, permission });
      return new ResourceShareLinkEntity(createdLink);
    }

    const updatedLink = await this.resourceShareLinkRepository.update({ id: existingLink.id }, { permission });
    if (!updatedLink) {
      throw new Exception(ResourceShareLinkErrorCodes.NOT_UPDATED);
    }

    return new ResourceShareLinkEntity(existingLink);
  }
}
