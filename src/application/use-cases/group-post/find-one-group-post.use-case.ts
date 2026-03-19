import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupPostErrorCodes } from '@application/errors';
import { GroupPostEntity } from '@domain/group-post/group-post.entity';
import {
  FilterGroupPost,
  GROUP_POST_REPOSITORY_TOKEN,
  IGroupPostRepository,
  RelationsGroupPost
} from '@domain/group-post/group-post.repository';

type FindOneGroupPostInput = {
  filters: FilterGroupPost;
  relations?: RelationsGroupPost;
};

@Injectable()
export class FindOneGroupPostUseCase {
  constructor(
    @Inject(GROUP_POST_REPOSITORY_TOKEN)
    private readonly groupPostRepository: IGroupPostRepository
  ) {}

  async execute(input: FindOneGroupPostInput): Promise<GroupPostEntity> {
    const { filters, relations } = input;

    const post = await this.groupPostRepository.findOne(filters, relations);
    if (!post) {
      throw new Exception(GroupPostErrorCodes.NOT_FOUND);
    }

    return new GroupPostEntity(post);
  }
}
