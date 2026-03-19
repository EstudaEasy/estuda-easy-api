import { Module } from '@nestjs/common';

import { ResourceFavoriteUseCasesModule } from '@application/use-cases/resource-favorite/resource-favorite.use-cases';

import { ResourceFavoriteController } from './resource-favorite.controller';

@Module({
  imports: [ResourceFavoriteUseCasesModule],
  controllers: [ResourceFavoriteController]
})
export class ResourceFavoriteModule {}
