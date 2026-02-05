import { Module } from '@nestjs/common';

import { GroupUseCasesModule } from '@application/use-cases/group/group.use-cases';
import { GroupController } from '@presentation/http/controllers/group/group.controller';

@Module({
  imports: [GroupUseCasesModule],
  controllers: [GroupController]
})
export class GroupModule {}
