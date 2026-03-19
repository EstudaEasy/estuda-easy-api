import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupPostErrorCodes } from '@application/errors';
import { GroupPostEntity } from '@domain/group-post/group-post.entity';
import {
  FilterGroupPost,
  GROUP_POST_REPOSITORY_TOKEN,
  IGroupPostRepository,
  UpdateGroupPost
} from '@domain/group-post/group-post.repository';

type UpdateGroupPostInput = {
  filters: FilterGroupPost;
  data: Omit<UpdateGroupPost, 'authorId' | 'groupId'>;
  userId: number;
};

@Injectable()
export class UpdateGroupPostUseCase {
  constructor(
    @Inject(GROUP_POST_REPOSITORY_TOKEN)
    private readonly groupPostRepository: IGroupPostRepository
  ) {}

  async execute(input: UpdateGroupPostInput): Promise<GroupPostEntity> {
    const { filters, data, userId } = input;

    const existingPost = await this.groupPostRepository.findOne(filters);
    if (!existingPost) {
      throw new Exception(GroupPostErrorCodes.NOT_FOUND);
    }

    if (existingPost.authorId !== userId) {
      throw new Exception(GroupPostErrorCodes.PERMISSION_DENIED);
    }

    const updatedPost = await this.groupPostRepository.update(filters, data);
    if (!updatedPost) {
      throw new Exception(GroupPostErrorCodes.NOT_UPDATED);
    }

    return new GroupPostEntity(updatedPost);
  }
}
