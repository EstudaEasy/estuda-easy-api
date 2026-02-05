import { Test } from '@nestjs/testing';

import { Exception, GroupMemberErrorCodes } from '@application/errors';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { RemoveGroupMemberUseCase } from '../remove-group-member.use-case';

describe('Use Cases -> Group Member -> Remove', () => {
  let removeGroupMemberUseCase: RemoveGroupMemberUseCase;

  const groupId = 'test-group-id';

  const ownerMember = new GroupMemberMock({
    id: 1,
    groupId,
    userId: 1,
    role: GroupMemberRole.OWNER
  });

  const adminMember = new GroupMemberMock({
    id: 2,
    groupId,
    userId: 2,
    role: GroupMemberRole.ADMIN
  });

  const regularMember = new GroupMemberMock({
    id: 3,
    groupId,
    userId: 3,
    role: GroupMemberRole.MEMBER
  });

  const groupMemberRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        RemoveGroupMemberUseCase,
        {
          provide: GROUP_MEMBER_REPOSITORY_TOKEN,
          useValue: groupMemberRepositoryMock
        }
      ]
    }).compile();

    removeGroupMemberUseCase = module.get<RemoveGroupMemberUseCase>(RemoveGroupMemberUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should remove member - owner removing regular member', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(ownerMember);
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(regularMember);
    groupMemberRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      groupId,
      memberId: regularMember.id,
      requesterId: ownerMember.userId
    };

    await expect(removeGroupMemberUseCase.execute(input)).resolves.toBeUndefined();

    expect(groupMemberRepositoryMock.findOne).toHaveBeenNthCalledWith(1, {
      groupId,
      userId: ownerMember.userId
    });
    expect(groupMemberRepositoryMock.findOne).toHaveBeenNthCalledWith(2, {
      id: regularMember.id,
      groupId
    });
    expect(groupMemberRepositoryMock.delete).toHaveBeenCalledWith({ id: regularMember.id });
  });

  it('should remove member - admin removing regular member', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(adminMember);
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(regularMember);
    groupMemberRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      groupId,
      memberId: regularMember.id,
      requesterId: adminMember.userId
    };

    await expect(removeGroupMemberUseCase.execute(input)).resolves.toBeUndefined();

    expect(groupMemberRepositoryMock.findOne).toHaveBeenNthCalledWith(1, {
      groupId,
      userId: adminMember.userId
    });
    expect(groupMemberRepositoryMock.findOne).toHaveBeenNthCalledWith(2, {
      id: regularMember.id,
      groupId
    });
    expect(groupMemberRepositoryMock.delete).toHaveBeenCalledWith({ id: regularMember.id });
  });

  it('should remove member - member leaving group (self-removal)', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(regularMember);
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(regularMember);
    groupMemberRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      groupId,
      memberId: regularMember.id,
      requesterId: regularMember.userId
    };

    await expect(removeGroupMemberUseCase.execute(input)).resolves.toBeUndefined();

    expect(groupMemberRepositoryMock.delete).toHaveBeenCalledWith({ id: regularMember.id });
  });

  it('should not remove - requester not found', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(null);

    const input = {
      groupId,
      memberId: regularMember.id,
      requesterId: 999
    };

    await expect(removeGroupMemberUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupMemberErrorCodes.NOT_FOUND)
    );
    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith({ groupId, userId: 999 });
    expect(groupMemberRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not remove - target member not found', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(ownerMember);
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(null);

    const input = {
      groupId,
      memberId: 999,
      requesterId: ownerMember.userId
    };

    await expect(removeGroupMemberUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupMemberErrorCodes.NOT_FOUND)
    );
    expect(groupMemberRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not remove - cannot remove owner', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(adminMember);
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(ownerMember);

    const input = {
      groupId,
      memberId: ownerMember.id,
      requesterId: adminMember.userId
    };

    await expect(removeGroupMemberUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupMemberErrorCodes.CANNOT_REMOVE_OWNER)
    );
    expect(groupMemberRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not remove - admin cannot remove another admin', async () => {
    const anotherAdmin = new GroupMemberMock({
      role: GroupMemberRole.ADMIN,
      groupId,
      userId: 4
    });

    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(adminMember);
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(anotherAdmin);

    const input = {
      groupId,
      memberId: anotherAdmin.id,
      requesterId: adminMember.userId
    };

    await expect(removeGroupMemberUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupMemberErrorCodes.PERMISSION_DENIED)
    );
    expect(groupMemberRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not remove - member cannot remove another member', async () => {
    const anotherMember = new GroupMemberMock({
      role: GroupMemberRole.MEMBER,
      groupId,
      userId: 5
    });

    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(regularMember);
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(anotherMember);

    const input = {
      groupId,
      memberId: anotherMember.id,
      requesterId: regularMember.userId
    };

    await expect(removeGroupMemberUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupMemberErrorCodes.PERMISSION_DENIED)
    );
    expect(groupMemberRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not remove - failed to delete', async () => {
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(ownerMember);
    groupMemberRepositoryMock.findOne.mockResolvedValueOnce(regularMember);
    groupMemberRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      groupId,
      memberId: regularMember.id,
      requesterId: ownerMember.userId
    };

    await expect(removeGroupMemberUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupMemberErrorCodes.NOT_DELETED)
    );
    expect(groupMemberRepositoryMock.delete).toHaveBeenCalledWith({ id: regularMember.id });
  });
});
