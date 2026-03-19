import { Test } from '@nestjs/testing';

import { Exception, GroupPostErrorCodes } from '@application/errors';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';
import { GROUP_POST_REPOSITORY_TOKEN } from '@domain/group-post/group-post.repository';

import { UpdateGroupPostUseCase } from '../update-group-post.use-case';

describe('Use Cases -> Group Post -> Update', () => {
  let updateGroupPostUseCase: UpdateGroupPostUseCase;

  const post = new GroupPostMock({ authorId: 1 });

  const groupPostRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateGroupPostUseCase,
        {
          provide: GROUP_POST_REPOSITORY_TOKEN,
          useValue: groupPostRepositoryMock
        }
      ]
    }).compile();

    updateGroupPostUseCase = module.get<UpdateGroupPostUseCase>(UpdateGroupPostUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update group post when requester is author', async () => {
    const updatedPost = new GroupPostMock({ ...post, content: 'Updated post content' });

    groupPostRepositoryMock.findOne.mockResolvedValue(post);
    groupPostRepositoryMock.update.mockResolvedValue(updatedPost);

    const input = {
      filters: { id: post.id },
      data: { content: 'Updated post content' },
      userId: post.authorId
    };

    const result = await updateGroupPostUseCase.execute(input);

    expect(groupPostRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(groupPostRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(updatedPost);
  });

  it('should not update - post not found', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: post.id },
      data: { content: 'Updated post content' },
      userId: post.authorId
    };

    await expect(updateGroupPostUseCase.execute(input)).rejects.toThrow(new Exception(GroupPostErrorCodes.NOT_FOUND));
    expect(groupPostRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - requester is not author', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);

    const input = {
      filters: { id: post.id },
      data: { content: 'Updated post content' },
      userId: 999
    };

    await expect(updateGroupPostUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupPostErrorCodes.PERMISSION_DENIED)
    );
    expect(groupPostRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - update operation fails', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);
    groupPostRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: post.id },
      data: { content: 'Updated post content' },
      userId: post.authorId
    };

    await expect(updateGroupPostUseCase.execute(input)).rejects.toThrow(new Exception(GroupPostErrorCodes.NOT_UPDATED));
  });
});
