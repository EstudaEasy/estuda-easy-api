import { Inject, Injectable } from '@nestjs/common';

import { ResourceShareEntity } from '@domain/resource-share/resource-share.entity';
import {
  FilterResourceShare,
  IResourceShareRepository,
  RESOURCE_SHARE_REPOSITORY_TOKEN,
  RelationsResourceShare
} from '@domain/resource-share/resource-share.repository';

type FindResourceSharesInput = {
  filters?: FilterResourceShare;
  relations?: RelationsResourceShare;
};

type FindResourceSharesOutput = {
  shares: ResourceShareEntity[];
  total: number;
};

@Injectable()
export class FindResourceSharesUseCase {
  constructor(
    @Inject(RESOURCE_SHARE_REPOSITORY_TOKEN)
    private readonly resourceShareRepository: IResourceShareRepository
  ) {}

  async execute(input: FindResourceSharesInput = {}): Promise<FindResourceSharesOutput> {
    const { filters, relations } = input;

    const { shares, total } = await this.resourceShareRepository.find(filters, relations);

    return {
      shares: shares.map((share) => new ResourceShareEntity(share)),
      total
    };
  }
}
