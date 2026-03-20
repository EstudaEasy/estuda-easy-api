import { Inject, Injectable } from '@nestjs/common';

import { GroupPostEntity } from '@domain/group-post/group-post.entity';
import {
  FilterGroupPost,
  GROUP_POST_REPOSITORY_TOKEN,
  IGroupPostRepository,
  RelationsGroupPost
} from '@domain/group-post/group-post.repository';

type FindGroupPostsInput = {
  filters?: FilterGroupPost;
  relations?: RelationsGroupPost;
};

type FindGroupPostsOutput = {
  posts: GroupPostEntity[];
  total: number;
};

@Injectable()
export class FindGroupPostsUseCase {
  constructor(
    @Inject(GROUP_POST_REPOSITORY_TOKEN)
    private readonly groupPostRepository: IGroupPostRepository
  ) {}

  async execute(input: FindGroupPostsInput = {}): Promise<FindGroupPostsOutput> {
    const { filters, relations } = input;

    const { posts, total } = await this.groupPostRepository.find(filters, relations, { createdAt: 'DESC' });

    return {
      posts: posts.map((post) => new GroupPostEntity(post)),
      total
    };
  }
}
