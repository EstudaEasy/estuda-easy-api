import { Test } from '@nestjs/testing';

import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { GROUP_REPOSITORY_TOKEN } from '@domain/repositories/group/group.repository';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { CreateGroupUseCase } from '../create-group.use-case';

describe('Use Cases -> Group -> Create', () => {
  let createGroupUseCase: CreateGroupUseCase;

  const userId = 1;
  const group = new GroupMock();

  const groupMember = new GroupMemberMock({
    groupId: group.id,
    userId,
    role: GroupMemberRole.OWNER
  });

  const groupRepositoryMock = {
    create: jest.fn()
  };

  const groupMemberRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateGroupUseCase,
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

    createGroupUseCase = module.get<CreateGroupUseCase>(CreateGroupUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create group and add creator as owner', async () => {
    groupRepositoryMock.create.mockResolvedValue(group);
    groupMemberRepositoryMock.create.mockResolvedValue(groupMember);

    const input = {
      data: {
        name: group.name,
        description: group.description
      },
      userId
    };

    const result = await createGroupUseCase.execute(input);

    expect(groupRepositoryMock.create).toHaveBeenCalledWith({
      ...input.data,
      inviteCode: expect.any(String)
    });
    expect(groupMemberRepositoryMock.create).toHaveBeenCalledWith({
      groupId: group.id,
      userId,
      role: GroupMemberRole.OWNER
    });
    expect(result).toEqual(group);
  });

  it('should generate invite code with 8 characters', async () => {
    groupRepositoryMock.create.mockResolvedValue(group);
    groupMemberRepositoryMock.create.mockResolvedValue(groupMember);

    const input = {
      data: {
        name: group.name,
        description: group.description
      },
      userId
    };

    await createGroupUseCase.execute(input);

    const createCall = groupRepositoryMock.create.mock.calls[0][0];
    expect(createCall.inviteCode).toHaveLength(8);
  });
});
