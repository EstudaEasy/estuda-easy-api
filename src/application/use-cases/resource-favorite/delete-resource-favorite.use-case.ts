import { Inject, Injectable } from '@nestjs/common';

import { ResourceFavoriteErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import {
  IResourceFavoriteRepository,
  RESOURCE_FAVORITE_REPOSITORY_TOKEN
} from '@domain/resource-favorite/resource-favorite.repository';

type DeleteResourceFavoriteInput = {
  favoriteId: string;
  userId: number;
};

@Injectable()
export class DeleteResourceFavoriteUseCase {
  constructor(
    @Inject(RESOURCE_FAVORITE_REPOSITORY_TOKEN)
    private readonly resourceFavoriteRepository: IResourceFavoriteRepository
  ) {}

  async execute(input: DeleteResourceFavoriteInput): Promise<void> {
    const { favoriteId, userId } = input;

    const favorite = await this.resourceFavoriteRepository.findOne({ id: favoriteId });
    if (!favorite) {
      throw new Exception(ResourceFavoriteErrorCodes.NOT_FOUND);
    }

    if (favorite.userId !== userId) {
      throw new Exception(ResourceFavoriteErrorCodes.PERMISSION_DENIED);
    }

    const deleted = await this.resourceFavoriteRepository.delete({ id: favoriteId });
    if (!deleted) {
      throw new Exception(ResourceFavoriteErrorCodes.NOT_DELETED);
    }
  }
}
