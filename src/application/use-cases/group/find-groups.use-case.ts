import { Inject, Injectable } from '@nestjs/common';

import { GroupEntity } from '@domain/entities/group/group.entity';
import {
  FilterGroup,
  GROUP_REPOSITORY_TOKEN,
  IGroupRepository,
  RelationsGroup
} from '@domain/repositories/group/group.repository';

type FindGroupsInput = {
  filters?: FilterGroup;
  relations?: RelationsGroup;
};

type FindGroupsOutput = {
  groups: GroupEntity[];
  total: number;
};

@Injectable()
export class FindGroupsUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY_TOKEN)
    private readonly groupRepository: IGroupRepository
  ) {}

  async execute(input: FindGroupsInput = {}): Promise<FindGroupsOutput> {
    const { filters, relations } = input;

    const { groups, total } = await this.groupRepository.find(filters, relations);

    return {
      groups: groups.map((group) => new GroupEntity(group)),
      total
    };
  }
}
