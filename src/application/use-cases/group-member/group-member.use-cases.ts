import { Module } from '@nestjs/common';

import { GroupMemberRepositoryModule } from '@database/typeorm/repository/group-member/group-member.repository';

import { ChangeMemberRoleUseCase } from './change-member-role.use-case';
import { FindGroupMembersUseCase } from './find-group-members.use-case';
import { FindOneGroupMemberUseCase } from './find-one-group-member.use-case';
import { RemoveGroupMemberUseCase } from './remove-group-member.use-case';

@Module({
  imports: [GroupMemberRepositoryModule],
  providers: [FindGroupMembersUseCase, FindOneGroupMemberUseCase, ChangeMemberRoleUseCase, RemoveGroupMemberUseCase],
  exports: [FindGroupMembersUseCase, FindOneGroupMemberUseCase, ChangeMemberRoleUseCase, RemoveGroupMemberUseCase]
})
export class GroupMemberUseCasesModule {}
