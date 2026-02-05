import { Inject, Injectable } from '@nestjs/common';

import { GroupMemberEntity } from '@domain/entities/group-member/group-member.entity';
import {
  FilterGroupMember,
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository,
  RelationsGroupMember
} from '@domain/repositories/group-member/group-member.repository';

type FindGroupMembersInput = {
  filters?: FilterGroupMember;
  relations?: RelationsGroupMember;
};

type FindGroupMembersOutput = {
  members: GroupMemberEntity[];
  total: number;
};

@Injectable()
export class FindGroupMembersUseCase {
  constructor(
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: FindGroupMembersInput): Promise<FindGroupMembersOutput> {
    const { filters, relations } = input;

    const { members, total } = await this.groupMemberRepository.find(filters, relations);

    return {
      members: members.map((member) => new GroupMemberEntity(member)),
      total
    };
  }
}
