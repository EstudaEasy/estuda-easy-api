import { Module } from '@nestjs/common';

import { ResourceConversionUseCasesModule } from '@application/use-cases/resource-conversion/resource-conversion.use-cases';

import { ResourceConversionController } from './resource-conversion.controller';

@Module({
  imports: [ResourceConversionUseCasesModule],
  controllers: [ResourceConversionController]
})
export class ResourceConversionModule {}
