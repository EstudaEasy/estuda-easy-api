import { Module } from '@nestjs/common';

import { GroupRepositoryModule } from '@database/typeorm/repository/group/group.repository';
import { GroupMemberRepositoryModule } from '@database/typeorm/repository/group-member/group-member.repository';

import { AddGroupMemberUseCase } from './add-group-member.use-case';
import { ChangeMemberRoleUseCase } from './change-member-role.use-case';
import { FindGroupMembersUseCase } from './find-group-members.use-case';
import { FindOneGroupMemberUseCase } from './find-one-group-member.use-case';
import { RemoveGroupMemberUseCase } from './remove-group-member.use-case';

@Module({
  imports: [GroupRepositoryModule, GroupMemberRepositoryModule],
  providers: [
    AddGroupMemberUseCase,
    FindGroupMembersUseCase,
    FindOneGroupMemberUseCase,
    ChangeMemberRoleUseCase,
    RemoveGroupMemberUseCase
  ],
  exports: [
    AddGroupMemberUseCase,
    FindGroupMembersUseCase,
    FindOneGroupMemberUseCase,
    ChangeMemberRoleUseCase,
    RemoveGroupMemberUseCase
  ]
})
export class GroupMemberUseCasesModule {}
