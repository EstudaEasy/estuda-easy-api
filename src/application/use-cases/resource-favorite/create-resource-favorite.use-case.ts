import { Inject, Injectable } from '@nestjs/common';

import { ResourceErrorCodes, ResourceFavoriteErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { ResourceFavoriteEntity } from '@domain/resource-favorite/resource-favorite.entity';
import {
  IResourceFavoriteRepository,
  RESOURCE_FAVORITE_REPOSITORY_TOKEN
} from '@domain/resource-favorite/resource-favorite.repository';

export type CreateResourceFavoriteInput = {
  userId: number;
  resourceId: string;
};

@Injectable()
export class CreateResourceFavoriteUseCase {
  constructor(
    @Inject(RESOURCE_FAVORITE_REPOSITORY_TOKEN)
    private readonly resourceFavoriteRepository: IResourceFavoriteRepository,
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository
  ) {}

  async execute(input: CreateResourceFavoriteInput): Promise<ResourceFavoriteEntity> {
    const { userId, resourceId } = input;

    const resource = await this.resourceRepository.findOne({ id: resourceId });
    if (!resource) {
      throw new Exception(ResourceErrorCodes.NOT_FOUND);
    }

    const existingFavorite = await this.resourceFavoriteRepository.findOne({ userId, resourceId });
    if (existingFavorite) {
      throw new Exception(ResourceFavoriteErrorCodes.ALREADY_EXISTS);
    }

    const createdFavorite = await this.resourceFavoriteRepository.create({ userId, resourceId });

    return new ResourceFavoriteEntity(createdFavorite);
  }
}
