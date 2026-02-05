import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupErrorCodes, GroupMemberErrorCodes } from '@application/errors';
import { GroupMemberEntity } from '@domain/entities/group-member/group-member.entity';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { GROUP_REPOSITORY_TOKEN, IGroupRepository } from '@domain/repositories/group/group.repository';
import {
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository
} from '@domain/repositories/group-member/group-member.repository';

type JoinGroupInput = {
  inviteCode: string;
  userId: number;
};

@Injectable()
export class JoinGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY_TOKEN)
    private readonly groupRepository: IGroupRepository,
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: JoinGroupInput): Promise<GroupMemberEntity> {
    const { inviteCode, userId } = input;

    const group = await this.groupRepository.findOne({ inviteCode });
    if (!group) {
      throw new Exception(GroupErrorCodes.NOT_FOUND);
    }

    const existingMember = await this.groupMemberRepository.findOne({ groupId: group.id, userId });
    if (existingMember) {
      throw new Exception(GroupMemberErrorCodes.ALREADY_MEMBER);
    }

    const member = await this.groupMemberRepository.create({
      groupId: group.id,
      userId,
      role: GroupMemberRole.MEMBER
    });

    return new GroupMemberEntity(member);
  }
}
