import { Test } from '@nestjs/testing';

import { GroupMemberErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { GroupMemberMock } from '@domain/group-member/__mocks__/group-member.mock';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/group-member/group-member.repository';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';
import { GROUP_POST_REPOSITORY_TOKEN } from '@domain/group-post/group-post.repository';

import { CreateGroupPostUseCase } from '../create-group-post.use-case';

describe('Use Cases -> Group Post -> Create', () => {
  let createGroupPostUseCase: CreateGroupPostUseCase;

  const userId = 1;
  const post = new GroupPostMock({ authorId: userId });
  const groupMember = new GroupMemberMock({ groupId: post.groupId, userId });

  const groupPostRepositoryMock = {
    create: jest.fn()
  };

  const groupMemberRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateGroupPostUseCase,
        {
          provide: GROUP_POST_REPOSITORY_TOKEN,
          useValue: groupPostRepositoryMock
        },
        {
          provide: GROUP_MEMBER_REPOSITORY_TOKEN,
          useValue: groupMemberRepositoryMock
        }
      ]
    }).compile();

    createGroupPostUseCase = module.get<CreateGroupPostUseCase>(CreateGroupPostUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create group post when author belongs to group', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValue(groupMember);
    groupPostRepositoryMock.create.mockResolvedValue(post);

    const input = {
      data: {
        content: post.content,
        groupId: post.groupId
      },
      userId
    };

    const result = await createGroupPostUseCase.execute(input);

    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith({
      groupId: post.groupId,
      userId
    });
    expect(groupPostRepositoryMock.create).toHaveBeenCalledWith({
      ...input.data,
      authorId: userId
    });
    expect(result).toEqual(post);
  });

  it('should not create group post when author is not a group member', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      data: {
        content: post.content,
        groupId: post.groupId
      },
      userId
    };

    await expect(createGroupPostUseCase.execute(input)).rejects.toThrow(new Exception(GroupMemberErrorCodes.NOT_FOUND));
    expect(groupPostRepositoryMock.create).not.toHaveBeenCalled();
  });
});
