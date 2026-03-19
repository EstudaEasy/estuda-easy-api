import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupMemberErrorCodes } from '@application/errors';
import { GROUP_MEMBER_REPOSITORY_TOKEN, IGroupMemberRepository } from '@domain/group-member/group-member.repository';
import { GroupPostEntity } from '@domain/group-post/group-post.entity';
import {
  CreateGroupPost,
  GROUP_POST_REPOSITORY_TOKEN,
  IGroupPostRepository
} from '@domain/group-post/group-post.repository';

export interface CreateGroupPostInput {
  data: Omit<CreateGroupPost, 'authorId'>;
  userId: number;
}

@Injectable()
export class CreateGroupPostUseCase {
  constructor(
    @Inject(GROUP_POST_REPOSITORY_TOKEN)
    private readonly groupPostRepository: IGroupPostRepository,
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: CreateGroupPostInput): Promise<GroupPostEntity> {
    const { data, userId } = input;

    const member = await this.groupMemberRepository.findOne({
      groupId: data.groupId,
      userId
    });

    if (!member) {
      throw new Exception(GroupMemberErrorCodes.NOT_FOUND);
    }

    const groupPost = await this.groupPostRepository.create({
      ...data,
      authorId: userId
    });

    return new GroupPostEntity(groupPost);
  }
}
