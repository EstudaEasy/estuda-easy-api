import { Test } from '@nestjs/testing';

import { GroupPostErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { GroupMemberMock } from '@domain/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/group-member/group-member.interface';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/group-member/group-member.repository';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';
import { GROUP_POST_REPOSITORY_TOKEN } from '@domain/group-post/group-post.repository';
import { In } from '@shared/utils';

import { DeleteGroupPostUseCase } from '../delete-group-post.use-case';

describe('Use Cases -> Group Post -> Delete', () => {
  let deleteGroupPostUseCase: DeleteGroupPostUseCase;

  const post = new GroupPostMock({ authorId: 1 });

  const ownerMember = new GroupMemberMock({
    groupId: post.groupId,
    userId: 2,
    role: GroupMemberRole.OWNER
  });

  const adminMember = new GroupMemberMock({
    groupId: post.groupId,
    userId: 3,
    role: GroupMemberRole.ADMIN
  });

  const regularMember = new GroupMemberMock({
    groupId: post.groupId,
    userId: 4,
    role: GroupMemberRole.MEMBER
  });

  const groupPostRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  const groupMemberRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteGroupPostUseCase,
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

    deleteGroupPostUseCase = module.get<DeleteGroupPostUseCase>(DeleteGroupPostUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete group post when requester is author', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);
    groupPostRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: post.id },
      userId: post.authorId
    };

    await expect(deleteGroupPostUseCase.execute(input)).resolves.toBeUndefined();

    expect(groupPostRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(groupMemberRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(groupPostRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should delete group post when requester is group owner', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);
    groupMemberRepositoryMock.findOne.mockResolvedValue(ownerMember);
    groupPostRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: post.id },
      userId: ownerMember.userId
    };

    await expect(deleteGroupPostUseCase.execute(input)).resolves.toBeUndefined();

    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith({
      groupId: post.groupId,
      userId: ownerMember.userId,
      role: In([GroupMemberRole.OWNER, GroupMemberRole.ADMIN])
    });
    expect(groupPostRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should delete group post when requester is group admin', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);
    groupMemberRepositoryMock.findOne.mockResolvedValue(adminMember);
    groupPostRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: post.id },
      userId: adminMember.userId
    };

    await expect(deleteGroupPostUseCase.execute(input)).resolves.toBeUndefined();
  });

  it('should not delete - post not found', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: post.id },
      userId: post.authorId
    };

    await expect(deleteGroupPostUseCase.execute(input)).rejects.toThrow(new Exception(GroupPostErrorCodes.NOT_FOUND));
    expect(groupMemberRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(groupPostRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - requester is neither author nor owner/admin', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);
    groupMemberRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: post.id },
      userId: regularMember.userId
    };

    await expect(deleteGroupPostUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupPostErrorCodes.PERMISSION_DENIED)
    );
    expect(groupPostRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - requester is not group member', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);
    groupMemberRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: post.id },
      userId: 999
    };

    await expect(deleteGroupPostUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupPostErrorCodes.PERMISSION_DENIED)
    );
    expect(groupPostRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - delete operation fails', async () => {
    groupPostRepositoryMock.findOne.mockResolvedValue(post);
    groupPostRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: post.id },
      userId: post.authorId
    };

    await expect(deleteGroupPostUseCase.execute(input)).rejects.toThrow(new Exception(GroupPostErrorCodes.NOT_DELETED));
  });
});
