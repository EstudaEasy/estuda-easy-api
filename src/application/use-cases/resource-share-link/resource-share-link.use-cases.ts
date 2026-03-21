import { Module } from '@nestjs/common';

import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';
import { ResourceShareLinkRepositoryModule } from '@database/typeorm/repository/resource-share-link/resource-share-link.repository';

import { DeleteResourceShareLinkUseCase } from './delete-resource-share-link.use-case';
import { FindOneResourceShareLinkUseCase } from './find-one-resource-share-link.use-case';
import { GenerateResourceShareLinkUseCase } from './generate-resource-share-link.use-case';

@Module({
  imports: [ResourceRepositoryModule, ResourceShareLinkRepositoryModule],
  providers: [GenerateResourceShareLinkUseCase, FindOneResourceShareLinkUseCase, DeleteResourceShareLinkUseCase],
  exports: [GenerateResourceShareLinkUseCase, FindOneResourceShareLinkUseCase, DeleteResourceShareLinkUseCase]
})
export class ResourceShareLinkUseCasesModule {}
