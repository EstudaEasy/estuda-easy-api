import { Inject, Injectable } from '@nestjs/common';

import { Exception, ResourceShareErrorCodes } from '@application/errors';
import {
  IResourceShareRepository,
  RESOURCE_SHARE_REPOSITORY_TOKEN
} from '@domain/resource-share/resource-share.repository';

type DeleteResourceShareLinkInput = {
  shareId: number;
  userId: number;
};

@Injectable()
export class DeleteResourceShareUseCase {
  constructor(
    @Inject(RESOURCE_SHARE_REPOSITORY_TOKEN)
    private readonly resourceShareRepository: IResourceShareRepository
  ) {}

  async execute(input: DeleteResourceShareLinkInput): Promise<void> {
    const { shareId, userId } = input;

    const existingResourceShare = await this.resourceShareRepository.findOne({ id: shareId }, { resource: true });
    if (!existingResourceShare) {
      throw new Exception(ResourceShareErrorCodes.NOT_FOUND);
    }

    if (existingResourceShare.resource?.userId !== userId) {
      throw new Exception(ResourceShareErrorCodes.NOT_OWNER);
    }

    const deletedResourceShare = await this.resourceShareRepository.delete({ id: shareId });
    if (!deletedResourceShare) {
      throw new Exception(ResourceShareErrorCodes.NOT_DELETED);
    }
  }
}
