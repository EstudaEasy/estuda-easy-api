import { Test } from '@nestjs/testing';

import { GroupPostErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';
import { GROUP_POST_REPOSITORY_TOKEN } from '@domain/group-post/group-post.repository';

import { FindOneGroupPostUseCase } from '../find-one-group-post.use-case';

describe('Use Cases -> Group Post -> Find One', () => {
  let findOneGroupPostUseCase: FindOneGroupPostUseCase;

  const post = new GroupPostMock();

  const groupPostRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneGroupPostUseCase,
        {
          provide: GROUP_POST_REPOSITORY_TOKEN,
          useValue: groupPostRepositoryMock
        }
      ]
    }).compile();

    findOneGroupPostUseCase = module.get<FindOneGroupPostUseCase>(FindOneGroupPostUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one group post', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);

    const input = {
      filters: { id: post.id },
      relations: { author: true }
    };

    const result = await findOneGroupPostUseCase.execute(input);

    expect(groupPostRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(post);
  });

  it('should not find group post - post not found', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: post.id }
    };

    await expect(findOneGroupPostUseCase.execute(input)).rejects.toThrow(new Exception(GroupPostErrorCodes.NOT_FOUND));
    expect(groupPostRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
