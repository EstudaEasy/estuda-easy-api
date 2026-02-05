import { Test } from '@nestjs/testing';

import { Exception, GroupErrorCodes } from '@application/errors';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { GROUP_REPOSITORY_TOKEN } from '@domain/repositories/group/group.repository';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { DeleteGroupUseCase } from '../delete-group.use-case';

describe('Use Cases -> Group -> Delete', () => {
  let deleteGroupUseCase: DeleteGroupUseCase;

  const group = new GroupMock();
  const userId = 1;

  const ownerMember = new GroupMemberMock({
    groupId: group.id,
    userId,
    role: GroupMemberRole.OWNER
  });

  const groupRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  const groupMemberRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteGroupUseCase,
        {
          provide: GROUP_REPOSITORY_TOKEN,
          useValue: groupRepositoryMock
        },
        {
          provide: GROUP_MEMBER_REPOSITORY_TOKEN,
          useValue: groupMemberRepositoryMock
        }
      ]
    }).compile();

    deleteGroupUseCase = module.get<DeleteGroupUseCase>(DeleteGroupUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete group when user is owner', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(ownerMember);
    groupRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: group.id },
      userId
    };

    await deleteGroupUseCase.execute(input);

    expect(groupRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith({
      userId,
      groupId: group.id,
      role: GroupMemberRole.OWNER
    });
    expect(groupRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should throw NOT_FOUND when group does not exist', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: 'non-existent-id' },
      userId
    };

    await expect(deleteGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupErrorCodes.NOT_FOUND));
    expect(groupMemberRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(groupRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should throw ONLY_OWNER_PERMISSION when user is not owner', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: group.id },
      userId: 999
    };

    await expect(deleteGroupUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupErrorCodes.ONLY_OWNER_PERMISSION)
    );
    expect(groupRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should throw NOT_DELETED when delete operation fails', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(ownerMember);
    groupRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: group.id },
      userId
    };

    await expect(deleteGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupErrorCodes.NOT_DELETED));
  });
});
