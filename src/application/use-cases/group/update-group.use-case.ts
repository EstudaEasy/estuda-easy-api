import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupErrorCodes, GroupMemberErrorCodes } from '@application/errors';
import { GroupEntity } from '@domain/entities/group/group.entity';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import {
  FilterGroup,
  GROUP_REPOSITORY_TOKEN,
  IGroupRepository,
  UpdateGroup
} from '@domain/repositories/group/group.repository';
import {
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository
} from '@domain/repositories/group-member/group-member.repository';

type UpdateGroupInput = {
  filters: FilterGroup;
  data: Omit<UpdateGroup, 'inviteCode'>;
  userId: number;
};

@Injectable()
export class UpdateGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY_TOKEN)
    private readonly groupRepository: IGroupRepository,
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: UpdateGroupInput): Promise<GroupEntity> {
    const { filters, data, userId } = input;

    const existingGroup = await this.groupRepository.findOne(filters);
    if (!existingGroup) {
      throw new Exception(GroupErrorCodes.NOT_FOUND);
    }

    const member = await this.groupMemberRepository.findOne({ userId, groupId: existingGroup.id });
    if (!member) {
      throw new Exception(GroupMemberErrorCodes.NOT_FOUND);
    }

    if (member.role !== GroupMemberRole.OWNER && member.role !== GroupMemberRole.ADMIN) {
      throw new Exception(GroupErrorCodes.PERMISSION_DENIED);
    }

    const updatedGroup = await this.groupRepository.update(filters, data);
    if (!updatedGroup) {
      throw new Exception(GroupErrorCodes.NOT_UPDATED);
    }

    return new GroupEntity(updatedGroup);
  }
}
