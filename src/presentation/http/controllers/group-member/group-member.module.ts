import { Module } from '@nestjs/common';

import { GroupMemberUseCasesModule } from '@application/use-cases/group-member/group-member.use-cases';

import { GroupMemberController } from './group-member.controller';

@Module({
  imports: [GroupMemberUseCasesModule],
  controllers: [GroupMemberController]
})
export class GroupMemberModule {}
