import { Module } from '@nestjs/common';

import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';
import { ResourceFavoriteRepositoryModule } from '@database/typeorm/repository/resource-favorite/resource-favorite.repository';

import { CreateResourceFavoriteUseCase } from './create-resource-favorite.use-case';
import { DeleteResourceFavoriteUseCase } from './delete-resource-favorite.use-case';
import { FindOneResourceFavoriteUseCase } from './find-one-resource-favorite.use-case';
import { FindResourceFavoritesUseCase } from './find-resource-favorites.use-case';

@Module({
  imports: [ResourceFavoriteRepositoryModule, ResourceRepositoryModule],
  providers: [
    CreateResourceFavoriteUseCase,
    DeleteResourceFavoriteUseCase,
    FindOneResourceFavoriteUseCase,
    FindResourceFavoritesUseCase
  ],
  exports: [
    CreateResourceFavoriteUseCase,
    DeleteResourceFavoriteUseCase,
    FindOneResourceFavoriteUseCase,
    FindResourceFavoritesUseCase
  ]
})
export class ResourceFavoriteUseCasesModule {}
