import { Inject, Injectable } from '@nestjs/common';

import { Exception, ResourceShareLinkErrorCodes } from '@application/errors';
import { ResourceShareEntity } from '@domain/resource-share/resource-share.entity';
import {
  RESOURCE_SHARE_REPOSITORY_TOKEN,
  IResourceShareRepository
} from '@domain/resource-share/resource-share.repository';
import {
  RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
  IResourceShareLinkRepository
} from '@domain/resource-share-link/resource-share-link.repository';

type CreateResourceShareFromLinkInput = {
  linkId: string;
  userId: number;
};

@Injectable()
export class CreateResourceShareFromLinkUseCase {
  constructor(
    @Inject(RESOURCE_SHARE_LINK_REPOSITORY_TOKEN)
    private readonly resourceShareLinkRepository: IResourceShareLinkRepository,
    @Inject(RESOURCE_SHARE_REPOSITORY_TOKEN)
    private readonly resourceShareRepository: IResourceShareRepository
  ) {}

  async execute(input: CreateResourceShareFromLinkInput): Promise<ResourceShareEntity> {
    const { linkId, userId } = input;

    const shareLink = await this.resourceShareLinkRepository.findOne({ id: linkId }, { resource: true });
    if (!shareLink) {
      throw new Exception(ResourceShareLinkErrorCodes.NOT_FOUND);
    }

    if (shareLink.resource?.userId === userId) {
      throw new Exception(ResourceShareLinkErrorCodes.OWNER_CANNOT_JOIN);
    }

    const { permission, resourceId } = shareLink;
    const existingShare = await this.resourceShareRepository.findOne({ resourceId, userId });

    if (!existingShare) {
      const createdShare = await this.resourceShareRepository.create({ userId, resourceId, permission });
      return new ResourceShareEntity(createdShare);
    }

    const updatedShare = await this.resourceShareRepository.update({ id: existingShare.id }, { permission });
    if (!updatedShare) {
      throw new Exception(ResourceShareLinkErrorCodes.NOT_UPDATED);
    }

    return new ResourceShareEntity(updatedShare);
  }
}
