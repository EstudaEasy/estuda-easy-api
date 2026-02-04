import { Test } from '@nestjs/testing';

import { Exception, GroupErrorCodes } from '@application/errors';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { GROUP_REPOSITORY_TOKEN } from '@domain/repositories/group/group.repository';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { ResetGroupInviteCodeUseCase } from '../reset-group-invite-code.use-case';

describe('Use Cases -> Group -> Reset Invite Code', () => {
  let resetGroupInviteCodeUseCase: ResetGroupInviteCodeUseCase;

  const group = new GroupMock();
  const userId = 1;

  const ownerMember = new GroupMemberMock({
    groupId: group.id,
    userId,
    role: GroupMemberRole.OWNER
  });

  const groupRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  const groupMemberRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResetGroupInviteCodeUseCase,
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

    resetGroupInviteCodeUseCase = module.get<ResetGroupInviteCodeUseCase>(ResetGroupInviteCodeUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should reset invite code when user is owner', async () => {
    const updatedGroup = new GroupMock({ ...group, inviteCode: 'NEWCODE1' });

    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(ownerMember);
    groupRepositoryMock.update.mockResolvedValue(updatedGroup);

    const input = {
      filters: { id: group.id },
      userId
    };

    const result = await resetGroupInviteCodeUseCase.execute(input);

    expect(groupRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith({
      userId,
      groupId: group.id,
      role: GroupMemberRole.OWNER
    });
    expect(groupRepositoryMock.update).toHaveBeenCalledWith(input.filters, {
      inviteCode: expect.any(String)
    });
    expect(result).toEqual(updatedGroup);
  });

  it('should generate new invite code with 8 characters', async () => {
    const updatedGroup = new GroupMock({ ...group, inviteCode: 'NEWCODE2' });

    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(ownerMember);
    groupRepositoryMock.update.mockResolvedValue(updatedGroup);

    const input = {
      filters: { id: group.id },
      userId
    };

    await resetGroupInviteCodeUseCase.execute(input);

    const updateCall = groupRepositoryMock.update.mock.calls[0][1];
    expect(updateCall.inviteCode).toHaveLength(8);
  });

  it('should throw NOT_FOUND when group does not exist', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: 'non-existent-id' },
      userId
    };

    await expect(resetGroupInviteCodeUseCase.execute(input)).rejects.toThrow(new Exception(GroupErrorCodes.NOT_FOUND));
    expect(groupMemberRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(groupRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw ONLY_OWNER_PERMISSION when user is not owner', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: group.id },
      userId: 999
    };

    await expect(resetGroupInviteCodeUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupErrorCodes.ONLY_OWNER_PERMISSION)
    );
    expect(groupRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw NOT_UPDATED when update operation fails', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(ownerMember);
    groupRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: group.id },
      userId
    };

    await expect(resetGroupInviteCodeUseCase.execute(input)).rejects.toThrow(
      new Exception(GroupErrorCodes.NOT_UPDATED)
    );
  });
});
