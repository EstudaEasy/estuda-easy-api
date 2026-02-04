import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupErrorCodes } from '@application/errors';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { FilterGroup, GROUP_REPOSITORY_TOKEN, IGroupRepository } from '@domain/repositories/group/group.repository';
import {
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository
} from '@domain/repositories/group-member/group-member.repository';

type DeleteGroupInput = {
  filters: FilterGroup;
  userId: number;
};

@Injectable()
export class DeleteGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY_TOKEN)
    private readonly groupRepository: IGroupRepository,
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: DeleteGroupInput): Promise<void> {
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

    const deleted = await this.groupRepository.delete(filters);
    if (!deleted) {
      throw new Exception(GroupErrorCodes.NOT_DELETED);
    }
  }
}
