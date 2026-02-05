import { Test } from '@nestjs/testing';

import { Exception, GroupMemberErrorCodes } from '@application/errors';
import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { ChangeMemberRoleUseCase } from '../change-member-role.use-case';

describe('Use Cases -> GroupMember -> Change Role', () => {
  let changeMemberRoleUseCase: ChangeMemberRoleUseCase;

  const groupId = 'group-id';

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
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ChangeMemberRoleUseCase,
        {
          provide: GROUP_MEMBER_REPOSITORY_TOKEN,
          useValue: groupMemberRepositoryMock
        }
      ]
    }).compile();

    changeMemberRoleUseCase = module.get<ChangeMemberRoleUseCase>(ChangeMemberRoleUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  describe('Owner permissions', () => {
    it('should allow owner to change member role to admin', async () => {
      const updatedMember = { ...regularMember, role: GroupMemberRole.ADMIN };

      groupMemberRepositoryMock.findOne
        .mockResolvedValueOnce(ownerMember) // requester
        .mockResolvedValueOnce(regularMember); // target
      groupMemberRepositoryMock.update.mockResolvedValue(updatedMember);

      const input = {
        groupId,
        memberId: regularMember.id,
        requesterId: ownerMember.userId,
        role: GroupMemberRole.ADMIN
      };

      const result = await changeMemberRoleUseCase.execute(input);

      expect(result.role).toBe(GroupMemberRole.ADMIN);
      expect(groupMemberRepositoryMock.update).toHaveBeenCalledWith(
        { id: regularMember.id },
        { role: GroupMemberRole.ADMIN }
      );
    });

    it('should allow owner to change admin role to member', async () => {
      const updatedMember = { ...adminMember, role: GroupMemberRole.MEMBER };

      groupMemberRepositoryMock.findOne
        .mockResolvedValueOnce(ownerMember) // requester
        .mockResolvedValueOnce(adminMember); // target
      groupMemberRepositoryMock.update.mockResolvedValue(updatedMember);

      const input = {
        groupId,
        memberId: adminMember.id,
        requesterId: ownerMember.userId,
        role: GroupMemberRole.MEMBER
      };

      const result = await changeMemberRoleUseCase.execute(input);

      expect(result.role).toBe(GroupMemberRole.MEMBER);
    });

    it('should not allow changing owner role', async () => {
      groupMemberRepositoryMock.findOne
        .mockResolvedValueOnce(ownerMember) // requester (owner trying to change self)
        .mockResolvedValueOnce(ownerMember); // target (owner)

      const input = {
        groupId,
        memberId: ownerMember.id,
        requesterId: ownerMember.userId,
        role: GroupMemberRole.ADMIN
      };

      await expect(changeMemberRoleUseCase.execute(input)).rejects.toThrow(
        new Exception(GroupMemberErrorCodes.CANNOT_CHANGE_OWNER_ROLE)
      );
      expect(groupMemberRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe('Admin permissions', () => {
    it('should allow admin to change member role to admin', async () => {
      const updatedMember = { ...regularMember, role: GroupMemberRole.ADMIN };

      groupMemberRepositoryMock.findOne
        .mockResolvedValueOnce(adminMember) // requester
        .mockResolvedValueOnce(regularMember); // target
      groupMemberRepositoryMock.update.mockResolvedValue(updatedMember);

      const input = {
        groupId,
        memberId: regularMember.id,
        requesterId: adminMember.userId,
        role: GroupMemberRole.ADMIN
      };

      const result = await changeMemberRoleUseCase.execute(input);

      expect(result.role).toBe(GroupMemberRole.ADMIN);
    });

    it('should not allow admin to change another admin role', async () => {
      const anotherAdmin = { ...adminMember, id: 4, userId: 4 };

      groupMemberRepositoryMock.findOne
        .mockResolvedValueOnce(adminMember) // requester
        .mockResolvedValueOnce(anotherAdmin); // target

      const input = {
        groupId,
        memberId: anotherAdmin.id,
        requesterId: adminMember.userId,
        role: GroupMemberRole.MEMBER
      };

      await expect(changeMemberRoleUseCase.execute(input)).rejects.toThrow(
        new Exception(GroupMemberErrorCodes.PERMISSION_DENIED)
      );
      expect(groupMemberRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe('Member permissions', () => {
    it('should not allow member to change any role', async () => {
      const anotherMember = { ...regularMember, id: 4, userId: 4 };

      groupMemberRepositoryMock.findOne
        .mockResolvedValueOnce(regularMember) // requester
        .mockResolvedValueOnce(anotherMember); // target

      const input = {
        groupId,
        memberId: anotherMember.id,
        requesterId: regularMember.userId,
        role: GroupMemberRole.ADMIN
      };

      await expect(changeMemberRoleUseCase.execute(input)).rejects.toThrow(
        new Exception(GroupMemberErrorCodes.PERMISSION_DENIED)
      );
      expect(groupMemberRepositoryMock.update).not.toHaveBeenCalled();
    });
  });

  describe('Error cases', () => {
    it('should throw error if requester not found', async () => {
      groupMemberRepositoryMock.findOne.mockResolvedValueOnce(null);

      const input = {
        groupId,
        memberId: regularMember.id,
        requesterId: 999,
        role: GroupMemberRole.ADMIN
      };

      await expect(changeMemberRoleUseCase.execute(input)).rejects.toThrow(
        new Exception(GroupMemberErrorCodes.NOT_FOUND)
      );
    });

    it('should throw error if target member not found', async () => {
      groupMemberRepositoryMock.findOne
        .mockResolvedValueOnce(ownerMember) // requester
        .mockResolvedValueOnce(null); // target

      const input = {
        groupId,
        memberId: 999,
        requesterId: ownerMember.userId,
        role: GroupMemberRole.ADMIN
      };

      await expect(changeMemberRoleUseCase.execute(input)).rejects.toThrow(
        new Exception(GroupMemberErrorCodes.NOT_FOUND)
      );
    });

    it('should throw error if update fails', async () => {
      groupMemberRepositoryMock.findOne
        .mockResolvedValueOnce(ownerMember) // requester
        .mockResolvedValueOnce(regularMember); // target
      groupMemberRepositoryMock.update.mockResolvedValue(null);

      const input = {
        groupId,
        memberId: regularMember.id,
        requesterId: ownerMember.userId,
        role: GroupMemberRole.ADMIN
      };

      await expect(changeMemberRoleUseCase.execute(input)).rejects.toThrow(
        new Exception(GroupMemberErrorCodes.NOT_UPDATED)
      );
    });
  });
});
