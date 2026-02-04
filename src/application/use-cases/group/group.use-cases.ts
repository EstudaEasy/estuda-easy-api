import { Module } from '@nestjs/common';

import { GroupRepositoryModule } from '@database/typeorm/repository/group/group.repository';
import { GroupMemberRepositoryModule } from '@database/typeorm/repository/group-member/group-member.repository';

import { CreateGroupUseCase } from './create-group.use-case';
import { DeleteGroupUseCase } from './delete-group.use-case';
import { FindGroupsUseCase } from './find-groups.use-case';
import { FindOneGroupUseCase } from './find-one-group.use-case';
import { JoinGroupUseCase } from './join-group.use-case';
import { ResetGroupInviteCodeUseCase } from './reset-group-invite-code.use-case';
import { UpdateGroupUseCase } from './update-group.use-case';

@Module({
  imports: [GroupRepositoryModule, GroupMemberRepositoryModule],
  providers: [
    CreateGroupUseCase,
    FindGroupsUseCase,
    FindOneGroupUseCase,
    UpdateGroupUseCase,
    DeleteGroupUseCase,
    ResetGroupInviteCodeUseCase,
    JoinGroupUseCase
  ],
  exports: [
    CreateGroupUseCase,
    FindGroupsUseCase,
    FindOneGroupUseCase,
    UpdateGroupUseCase,
    DeleteGroupUseCase,
    ResetGroupInviteCodeUseCase,
    JoinGroupUseCase
  ]
})
export class GroupUseCasesModule {}
