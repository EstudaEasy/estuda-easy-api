import { Module } from '@nestjs/common';

import { ResourceShareLinkUseCasesModule } from '@application/use-cases/resource-share-link/resource-share-link.use-cases';

import { ResourceShareLinkController } from './resource-share-link.controller';

@Module({
  imports: [ResourceShareLinkUseCasesModule],
  controllers: [ResourceShareLinkController]
})
export class ResourceShareLinkModule {}
