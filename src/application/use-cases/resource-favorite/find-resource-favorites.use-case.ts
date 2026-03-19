import { Inject, Injectable } from '@nestjs/common';

import { ResourceFavoriteEntity } from '@domain/resource-favorite/resource-favorite.entity';
import {
  FilterResourceFavorite,
  IResourceFavoriteRepository,
  RelationsResourceFavorite,
  RESOURCE_FAVORITE_REPOSITORY_TOKEN
} from '@domain/resource-favorite/resource-favorite.repository';

type FindResourceFavoritesInput = {
  filters?: FilterResourceFavorite;
  relations?: RelationsResourceFavorite;
};

type FindResourceFavoritesOutput = {
  favorites: ResourceFavoriteEntity[];
  total: number;
};

@Injectable()
export class FindResourceFavoritesUseCase {
  constructor(
    @Inject(RESOURCE_FAVORITE_REPOSITORY_TOKEN)
    private readonly resourceFavoriteRepository: IResourceFavoriteRepository
  ) {}

  async execute(input: FindResourceFavoritesInput = {}): Promise<FindResourceFavoritesOutput> {
    const { filters, relations } = input;

    const { favorites, total } = await this.resourceFavoriteRepository.find(
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

    return {
      favorites: favorites.map((favorite) => new ResourceFavoriteEntity(favorite)),
      total
    };
  }
}
