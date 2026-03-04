import { Inject, Injectable } from '@nestjs/common';

import { Exception, ResourceShareLinkErrorCodes } from '@application/errors';
import { ResourceShareLinkEntity } from '@domain/entities/resource-share-link/resource-share-link.entity';
import {
  FilterResourceShareLink,
  RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
  IResourceShareLinkRepository,
  RelationsResourceShareLink
} from '@domain/repositories/resource-share-link/resource-share-link.repository';

type FindOneResourceShareLinkInput = {
  filters: FilterResourceShareLink;
  relations?: RelationsResourceShareLink;
};

@Injectable()
export class FindOneResourceShareLinkUseCase {
  constructor(
    @Inject(RESOURCE_SHARE_LINK_REPOSITORY_TOKEN)
    private readonly resourceShareLinkRepository: IResourceShareLinkRepository
  ) {}

  async execute(input: FindOneResourceShareLinkInput): Promise<ResourceShareLinkEntity> {
    const { filters, relations } = input;

    const shareLink = await this.resourceShareLinkRepository.findOne(filters, relations);
    if (!shareLink) {
      throw new Exception(ResourceShareLinkErrorCodes.NOT_FOUND);
    }

    return new ResourceShareLinkEntity(shareLink);
  }
}
