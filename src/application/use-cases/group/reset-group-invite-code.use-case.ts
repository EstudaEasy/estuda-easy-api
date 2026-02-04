import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupErrorCodes } from '@application/errors';
import { GroupEntity } from '@domain/entities/group/group.entity';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { FilterGroup, GROUP_REPOSITORY_TOKEN, IGroupRepository } from '@domain/repositories/group/group.repository';
import {
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository
} from '@domain/repositories/group-member/group-member.repository';
import { Nanoid } from '@shared/utils/nanoid';

type ResetGroupInviteCodeInput = {
  filters: FilterGroup;
  userId: number;
};

@Injectable()
export class ResetGroupInviteCodeUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY_TOKEN)
    private readonly groupRepository: IGroupRepository,
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: ResetGroupInviteCodeInput): Promise<GroupEntity> {
    const { filters, userId } = input;

    const group = await this.groupRepository.findOne(filters);
    if (!group) {
      throw new Exception(GroupErrorCodes.NOT_FOUND);
    }

    const isOwner = await this.groupMemberRepository.findOne({
      userId,
      groupId: group.id,
      role: GroupMemberRole.OWNER
    });
    if (!isOwner) {
      throw new Exception(GroupErrorCodes.ONLY_OWNER_PERMISSION);
    }

    const inviteCode = Nanoid.generate(8);

    const updatedGroup = await this.groupRepository.update(filters, { inviteCode });
    if (!updatedGroup) {
      throw new Exception(GroupErrorCodes.NOT_UPDATED);
    }

    return new GroupEntity(updatedGroup);
  }
}
