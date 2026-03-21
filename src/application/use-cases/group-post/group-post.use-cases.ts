import { Module } from '@nestjs/common';

import { GroupMemberRepositoryModule } from '@database/typeorm/repository/group-member/group-member.repository';
import { GroupPostRepositoryModule } from '@database/typeorm/repository/group-post/group-post.repository';

import { CreateGroupPostUseCase } from './create-group-post.use-case';
import { DeleteGroupPostUseCase } from './delete-group-post.use-case';
import { FindGroupPostsUseCase } from './find-group-posts.use-case';
import { FindOneGroupPostUseCase } from './find-one-group-post.use-case';
import { UpdateGroupPostUseCase } from './update-group-post.use-case';

@Module({
  imports: [GroupPostRepositoryModule, GroupMemberRepositoryModule],
  providers: [
    CreateGroupPostUseCase,
    FindGroupPostsUseCase,
    FindOneGroupPostUseCase,
    UpdateGroupPostUseCase,
    DeleteGroupPostUseCase
  ],
  exports: [
    CreateGroupPostUseCase,
    FindGroupPostsUseCase,
    FindOneGroupPostUseCase,
    UpdateGroupPostUseCase,
    DeleteGroupPostUseCase
  ]
})
export class GroupPostUseCasesModule {}
