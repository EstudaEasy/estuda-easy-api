import { Inject, Injectable } from '@nestjs/common';

import { ResourceType } from '@domain/resource/resource.interface';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { WhiteboardEntity } from '@domain/whiteboard/whiteboard.entity';
import {
  CreateWhiteboard,
  IWhiteboardRepository,
  WHITEBOARD_REPOSITORY_TOKEN
} from '@domain/whiteboard/whiteboard.repository';

export interface CreateWhiteboardInput {
  data: Omit<CreateWhiteboard, 'resource'>;
  userId: number;
}

@Injectable()
export class CreateWhiteboardUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository,
    @Inject(WHITEBOARD_REPOSITORY_TOKEN)
    private readonly whiteboardRepository: IWhiteboardRepository
  ) {}

  async execute(input: CreateWhiteboardInput): Promise<WhiteboardEntity> {
    const { data, userId } = input;

    const resource = await this.resourceRepository.create({
      type: ResourceType.WHITEBOARD,
      userId
    });

    const whiteboard = await this.whiteboardRepository.create({
      ...data,
      resource
    });

    return new WhiteboardEntity(whiteboard);
  }
}
