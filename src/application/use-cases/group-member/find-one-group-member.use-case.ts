import { Inject, Injectable } from '@nestjs/common';

import { Exception, GroupMemberErrorCodes } from '@application/errors';
import { GroupMemberEntity } from '@domain/entities/group-member/group-member.entity';
import {
  FilterGroupMember,
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository,
  RelationsGroupMember
} from '@domain/repositories/group-member/group-member.repository';

type FindOneGroupMemberInput = {
  filters: FilterGroupMember;
  relations?: RelationsGroupMember;
};

@Injectable()
export class FindOneGroupMemberUseCase {
  constructor(
    @Inject(GROUP_MEMBER_REPOSITORY_TOKEN)
    private readonly groupMemberRepository: IGroupMemberRepository
  ) {}

  async execute(input: FindOneGroupMemberInput): Promise<GroupMemberEntity> {
    const { filters, relations } = input;

    const member = await this.groupMemberRepository.findOne(filters, relations);
    if (!member) {
      throw new Exception(GroupMemberErrorCodes.NOT_FOUND);
    }

    return new GroupMemberEntity(member);
  }
}
