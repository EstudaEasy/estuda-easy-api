import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupPostErrorCodes } from '@application/errors';
import { GroupMemberRole } from '@domain/group-member/group-member.interface';
import { GROUP_MEMBER_REPOSITORY_TOKEN, IGroupMemberRepository } from '@domain/group-member/group-member.repository';
import {
  FilterGroupPost,
  GROUP_POST_REPOSITORY_TOKEN,
  IGroupPostRepository
} from '@domain/group-post/group-post.repository';
import { In } from '@shared/utils';

type DeleteGroupPostInput = {
  filters: FilterGroupPost;
  userId: number;
};

@Injectable()
export class DeleteGroupPostUseCase {
  constructor(
    @Inject(GROUP_POST_REPOSITORY_TOKEN)
    private readonly groupPostRepository: IGroupPostRepository,
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: DeleteGroupPostInput): Promise<void> {
    const { filters, userId } = input;

    const post = await this.groupPostRepository.findOne(filters);
    if (!post) {
      throw new Exception(GroupPostErrorCodes.NOT_FOUND);
    }

    if (post.authorId !== userId) {
      const member = await this.groupMemberRepository.findOne({
        groupId: post.groupId,
        userId,
        role: In([GroupMemberRole.OWNER, GroupMemberRole.ADMIN])
      });

      if (!member) {
        throw new Exception(GroupPostErrorCodes.PERMISSION_DENIED);
      }
    }

    const deleted = await this.groupPostRepository.delete(filters);
    if (!deleted) {
      throw new Exception(GroupPostErrorCodes.NOT_DELETED);
    }
  }
}
