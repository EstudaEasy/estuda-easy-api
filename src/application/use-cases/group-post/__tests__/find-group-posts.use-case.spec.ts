import { Test } from '@nestjs/testing';

import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';
import { GROUP_POST_REPOSITORY_TOKEN } from '@domain/group-post/group-post.repository';

import { FindGroupPostsUseCase } from '../find-group-posts.use-case';

describe('Use Cases -> Group Post -> Find', () => {
  let findGroupPostsUseCase: FindGroupPostsUseCase;

  const posts = GroupPostMock.getList(2);
  const total = posts.length;

  const groupPostRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindGroupPostsUseCase,
        {
          provide: GROUP_POST_REPOSITORY_TOKEN,
          useValue: groupPostRepositoryMock
        }
      ]
    }).compile();

    findGroupPostsUseCase = module.get<FindGroupPostsUseCase>(FindGroupPostsUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find group posts', async () => {
    groupPostRepositoryMock.find.mockResolvedValue({ posts, total });

    const input = {
      filters: { groupId: posts[0].groupId },
      relations: { author: true }
    };

    const result = await findGroupPostsUseCase.execute(input);

    expect(groupPostRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.posts).toEqual(posts);
    expect(result.total).toBe(total);
  });

  it('should find group posts without params', async () => {
    groupPostRepositoryMock.find.mockResolvedValue({ posts, total });

    const result = await findGroupPostsUseCase.execute();

    expect(groupPostRepositoryMock.find).toHaveBeenCalledWith(undefined, undefined);
    expect(result.posts).toEqual(posts);
    expect(result.total).toBe(total);
  });
});
