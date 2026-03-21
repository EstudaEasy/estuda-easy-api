import { Inject, Injectable } from '@nestjs/common';

import { GroupErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { GroupEntity } from '@domain/group/group.entity';
import { FilterGroup, GROUP_REPOSITORY_TOKEN, IGroupRepository, RelationsGroup } from '@domain/group/group.repository';

type FindOneGroupInput = {
  filters: FilterGroup;
  relations?: RelationsGroup;
};

@Injectable()
export class FindOneGroupUseCase {
  constructor(
    @Inject(GROUP_REPOSITORY_TOKEN)
    private readonly groupRepository: IGroupRepository
  ) {}

  async execute(input: FindOneGroupInput): Promise<GroupEntity> {
    const { filters, relations } = input;

    const group = await this.groupRepository.findOne(filters, relations);
    if (!group) {
      throw new Exception(GroupErrorCodes.NOT_FOUND);
    }

    return new GroupEntity(group);
  }
}
