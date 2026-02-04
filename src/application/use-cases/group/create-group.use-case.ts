import { Inject, Injectable } from '@nestjs/common';

import { GroupEntity } from '@domain/entities/group/group.entity';
import { GroupMemberRole } from '@domain/entities/group-member/group-member.interface';
import { CreateGroup, GROUP_REPOSITORY_TOKEN, IGroupRepository } from '@domain/repositories/group/group.repository';
import {
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository
} from '@domain/repositories/group-member/group-member.repository';
import { Nanoid } from '@shared/utils/nanoid';

export interface CreateGroupInput {
  data: Omit<CreateGroup, 'inviteCode'>;
  userId: number;
}

@Injectable()
export class CreateGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY_TOKEN)
    private readonly groupRepository: IGroupRepository,
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: CreateGroupInput): Promise<GroupEntity> {
    const { data, userId } = input;

    const inviteCode = Nanoid.generate(8);

    const group = await this.groupRepository.create({
      ...data,
      inviteCode
    });

    await this.groupMemberRepository.create({
      groupId: group.id,
      userId,
      role: GroupMemberRole.OWNER
    });

    return new GroupEntity(group);
  }
}
