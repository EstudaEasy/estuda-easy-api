import { Inject, Injectable } from '@nestjs/common';

import { ResourceFavoriteErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { ResourceFavoriteEntity } from '@domain/resource-favorite/resource-favorite.entity';
import {
  FilterResourceFavorite,
  IResourceFavoriteRepository,
  RelationsResourceFavorite,
  RESOURCE_FAVORITE_REPOSITORY_TOKEN
} from '@domain/resource-favorite/resource-favorite.repository';

type FindOneResourceFavoriteInput = {
  filters: FilterResourceFavorite;
  relations?: RelationsResourceFavorite;
};

@Injectable()
export class FindOneResourceFavoriteUseCase {
  constructor(
    @Inject(RESOURCE_FAVORITE_REPOSITORY_TOKEN)
    private readonly resourceFavoriteRepository: IResourceFavoriteRepository
  ) {}

  async execute(input: FindOneResourceFavoriteInput): Promise<ResourceFavoriteEntity> {
    const { filters, relations } = input;

    const favorite = await this.resourceFavoriteRepository.findOne(
      filters,
      relations ?? {
        resource: {
          deck: true,
          diary: true,
          quiz: true,
          task: true,
          whiteboard: true
        }
      }
    );

    if (!favorite) {
      throw new Exception(ResourceFavoriteErrorCodes.NOT_FOUND);
    }

    return new ResourceFavoriteEntity(favorite);
  }
}
