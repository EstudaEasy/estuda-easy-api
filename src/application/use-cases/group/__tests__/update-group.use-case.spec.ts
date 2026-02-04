import { Test } from '@nestjs/testing';

import { Exception, GroupErrorCodes, GroupMemberErrorCodes } from '@application/errors';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { GROUP_REPOSITORY_TOKEN } from '@domain/repositories/group/group.repository';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { UpdateGroupUseCase } from '../update-group.use-case';

describe('Use Cases -> Group -> Update', () => {
  let updateGroupUseCase: UpdateGroupUseCase;

  const group = new GroupMock();
  const userId = 1;

  const ownerMember = new GroupMemberMock({
    groupId: group.id,
    userId,
    role: GroupMemberRole.OWNER
  });

  const adminMember = new GroupMemberMock({
    groupId: group.id,
    userId: 2,
    role: GroupMemberRole.ADMIN
  });

  const regularMember = new GroupMemberMock({
    groupId: group.id,
    userId: 3,
    role: GroupMemberRole.MEMBER
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
        UpdateGroupUseCase,
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

    updateGroupUseCase = module.get<UpdateGroupUseCase>(UpdateGroupUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update group when user is owner', async () => {
    const updatedGroup = new GroupMock({ ...group, name: 'Updated Name' });

    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(ownerMember);
    groupRepositoryMock.update.mockResolvedValue(updatedGroup);

    const input = {
      filters: { id: group.id },
      data: { name: 'Updated Name' },
      userId
    };

    const result = await updateGroupUseCase.execute(input);

    expect(groupRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(groupMemberRepositoryMock.findOne).toHaveBeenCalledWith({ userId, groupId: group.id });
    expect(groupRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(updatedGroup);
  });

  it('should update group when user is admin', async () => {
    const updatedGroup = new GroupMock({ ...group, description: 'Updated Description' });

    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(adminMember);
    groupRepositoryMock.update.mockResolvedValue(updatedGroup);

    const input = {
      filters: { id: group.id },
      data: { description: 'Updated Description' },
      userId: adminMember.userId
    };

    const result = await updateGroupUseCase.execute(input);

    expect(result).toEqual(updatedGroup);
  });

  it('should throw NOT_FOUND when group does not exist', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: 'non-existent-id' },
      data: { name: 'Updated Name' },
      userId
    };

    await expect(updateGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupErrorCodes.NOT_FOUND));
    expect(groupMemberRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(groupRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw NOT_FOUND when user is not a member', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: group.id },
      data: { name: 'Updated Name' },
      userId: 999
    };

    await expect(updateGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupMemberErrorCodes.NOT_FOUND));
    expect(groupRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw PERMISSION_DENIED when user is regular member', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(regularMember);

    const input = {
      filters: { id: group.id },
      data: { name: 'Updated Name' },
      userId: regularMember.userId
    };

    await expect(updateGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupErrorCodes.PERMISSION_DENIED));
    expect(groupRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw NOT_UPDATED when update operation fails', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);
    groupMemberRepositoryMock.findOne.mockResolvedValue(ownerMember);
    groupRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: group.id },
      data: { name: 'Updated Name' },
      userId
    };

    await expect(updateGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupErrorCodes.NOT_UPDATED));
  });
});
