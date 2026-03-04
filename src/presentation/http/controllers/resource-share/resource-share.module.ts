import { Module } from '@nestjs/common';

import { ResourceShareUseCasesModule } from '@application/use-cases/resource-share/resource-share.use-cases';

import { ResourceShareController } from './resource-share.controller';

@Module({
  imports: [ResourceShareUseCasesModule],
  controllers: [ResourceShareController]
})
export class ResourceShareModule {}
