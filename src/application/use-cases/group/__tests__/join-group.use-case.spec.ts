import { Test } from '@nestjs/testing';

import { Exception, GroupErrorCodes, GroupMemberErrorCodes } from '@application/errors';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { GROUP_REPOSITORY_TOKEN } from '@domain/repositories/group/group.repository';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { JoinGroupUseCase } from '../join-group.use-case';

describe('Use Cases -> Group -> Join', () => {
  let joinGroupUseCase: JoinGroupUseCase;

  const group = new GroupMock();
  const userId = 1;

  const newMember = new GroupMemberMock({
    groupId: group.id,
    userId,
    role: GroupMemberRole.MEMBER
  });

  const groupRepositoryMock = {
    findOne: jest.fn()
  };

  const groupMemberRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        JoinGroupUseCase,
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

    joinGroupUseCase = module.get<JoinGroupUseCase>(JoinGroupUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should join group with valid invite code', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(null); // User is not a member
    groupMemberRepositoryMock.create.mockResolvedValue(newMember);

    const input = {
      inviteCode: group.inviteCode,
      userId
    };

    const result = await joinGroupUseCase.execute(input);

    expect(groupRepositoryMock.findOne).toHaveBeenCalledWith({ inviteCode: input.inviteCode });
    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith({ groupId: group.id, userId });
    expect(groupMemberRepositoryMock.create).toHaveBeenCalledWith({
      groupId: group.id,
      userId,
      role: GroupMemberRole.MEMBER
    });
    expect(result).toEqual(newMember);
  });

  it('should throw NOT_FOUND when invite code is invalid', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      inviteCode: 'INVALID',
      userId
    };

    await expect(joinGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupErrorCodes.NOT_FOUND));
    expect(groupMemberRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(groupMemberRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw ALREADY_MEMBER when user is already a member', async () => {
    const existingMember = new GroupMemberMock({
      groupId: group.id,
      userId,
      role: GroupMemberRole.MEMBER
    });

    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(existingMember);

    const input = {
      inviteCode: group.inviteCode,
      userId
    };

    await expect(joinGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupMemberErrorCodes.ALREADY_MEMBER));
    expect(groupMemberRepositoryMock.create).not.toHaveBeenCalled();
  });
});
