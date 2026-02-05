import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupMemberErrorCodes } from '@application/errors';
import { GroupMemberEntity } from '@domain/entities/group-member/group-member.entity';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import {
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository
} from '@domain/repositories/group-member/group-member.repository';

type ChangeMemberRoleInput = {
  groupId: string;
  memberId: number;
  requesterId: number;
  role: GroupMemberRole;
};

@Injectable()
export class ChangeMemberRoleUseCase {
  constructor(
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: ChangeMemberRoleInput): Promise<GroupMemberEntity> {
    const { groupId, memberId, requesterId, role } = input;

    const requester = await this.groupMemberRepository.findOne({ groupId, userId: requesterId });
    if (!requester) {
      throw new Exception(GroupMemberErrorCodes.NOT_FOUND);
    }

    const targetMember = await this.groupMemberRepository.findOne({ id: memberId, groupId });
    if (!targetMember) {
      throw new Exception(GroupMemberErrorCodes.NOT_FOUND);
    }

    if (targetMember.role === GroupMemberRole.OWNER) {
      throw new Exception(GroupMemberErrorCodes.CANNOT_CHANGE_OWNER_ROLE);
    }

    if (requester.role === GroupMemberRole.ADMIN) {
      if (targetMember.role !== GroupMemberRole.MEMBER) {
        throw new Exception(GroupMemberErrorCodes.PERMISSION_DENIED);
      }
    }

    if (requester.role === GroupMemberRole.MEMBER) {
      throw new Exception(GroupMemberErrorCodes.PERMISSION_DENIED);
    }

    const updatedMember = await this.groupMemberRepository.update({ id: memberId }, { role });
    if (!updatedMember) {
      throw new Exception(GroupMemberErrorCodes.NOT_UPDATED);
    }

    return new GroupMemberEntity(updatedMember);
  }
}
