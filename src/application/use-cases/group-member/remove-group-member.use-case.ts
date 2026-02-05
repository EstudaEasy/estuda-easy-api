import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupMemberErrorCodes } from '@application/errors';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import {
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository
} from '@domain/repositories/group-member/group-member.repository';

type RemoveGroupMemberInput = {
  groupId: string;
  memberId: number;
  requesterId: number;
};

@Injectable()
export class RemoveGroupMemberUseCase {
  constructor(
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: RemoveGroupMemberInput): Promise<void> {
    const { groupId, memberId, requesterId } = input;

    const requester = await this.groupMemberRepository.findOne({ groupId, userId: requesterId });
    if (!requester) {
      throw new Exception(GroupMemberErrorCodes.NOT_FOUND);
    }

    const targetMember = await this.groupMemberRepository.findOne({ id: memberId, groupId });
    if (!targetMember) {
      throw new Exception(GroupMemberErrorCodes.NOT_FOUND);
    }

    if (targetMember.role === GroupMemberRole.OWNER) {
      throw new Exception(GroupMemberErrorCodes.CANNOT_REMOVE_OWNER);
    }

    if (requester.role === GroupMemberRole.ADMIN) {
      if (targetMember.role !== GroupMemberRole.MEMBER) {
        throw new Exception(GroupMemberErrorCodes.PERMISSION_DENIED);
      }
    }

    if (requester.role === GroupMemberRole.MEMBER) {
      if (targetMember.id !== requester.id) {
        throw new Exception(GroupMemberErrorCodes.PERMISSION_DENIED);
      }
    }

    const deleted = await this.groupMemberRepository.delete({ id: memberId });
    if (!deleted) {
      throw new Exception(GroupMemberErrorCodes.NOT_DELETED);
    }
  }
}
