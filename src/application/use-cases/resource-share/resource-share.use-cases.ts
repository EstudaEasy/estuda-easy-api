import { Module } from '@nestjs/common';

import { ResourceShareRepositoryModule } from '@database/typeorm/repository/resource-share/resource-share.repository';
import { ResourceShareLinkRepositoryModule } from '@database/typeorm/repository/resource-share-link/resource-share-link.repository';

import { CreateResourceShareFromLinkUseCase } from './create-resource-share-from-link.use-case';
import { DeleteResourceShareUseCase } from './delete-resource-share.use-case';
import { FindResourceSharesUseCase } from './find-resource-shares.use-case';
import { UpdateResourceShareUseCase } from './update-resource-share.use-case';

@Module({
  imports: [ResourceShareLinkRepositoryModule, ResourceShareRepositoryModule],
  providers: [
    CreateResourceShareFromLinkUseCase,
    FindResourceSharesUseCase,
    UpdateResourceShareUseCase,
    DeleteResourceShareUseCase
  ],
  exports: [
    CreateResourceShareFromLinkUseCase,
    FindResourceSharesUseCase,
    UpdateResourceShareUseCase,
    DeleteResourceShareUseCase
  ]
})
export class ResourceShareUseCasesModule {}
