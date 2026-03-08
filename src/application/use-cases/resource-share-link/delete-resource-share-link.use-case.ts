import { Inject, Injectable } from '@nestjs/common';

import { Exception, ResourceShareLinkErrorCodes } from '@application/errors';
import {
  RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
  IResourceShareLinkRepository
} from '@domain/resource-share-link/resource-share-link.repository';

type DeleteResourceShareLinkInput = {
  resourceId: string;
  userId: number;
};

@Injectable()
export class DeleteResourceShareLinkUseCase {
  constructor(
    @Inject(RESOURCE_SHARE_LINK_REPOSITORY_TOKEN)
    private readonly resourceShareLinkRepository: IResourceShareLinkRepository
  ) {}

  async execute(input: DeleteResourceShareLinkInput): Promise<void> {
    const { resourceId, userId } = input;

    const shareLink = await this.resourceShareLinkRepository.findOne({ resourceId }, { resource: true });
    if (!shareLink) {
      throw new Exception(ResourceShareLinkErrorCodes.NOT_FOUND);
    }

    if (shareLink.resource!.userId !== userId) {
      throw new Exception(ResourceShareLinkErrorCodes.INVALID_PERMISSION_TO_DELETE);
    }

    const deleted = await this.resourceShareLinkRepository.delete({ id: shareLink.id });
    if (!deleted) {
      throw new Exception(ResourceShareLinkErrorCodes.NOT_DELETED);
    }
  }
}
