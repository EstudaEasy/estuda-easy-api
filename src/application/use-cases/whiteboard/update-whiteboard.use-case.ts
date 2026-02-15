import { Inject, Injectable } from '@nestjs/common';

import { Exception, WhiteboardErrorCodes } from '@application/errors';
import { WhiteboardEntity } from '@domain/entities/whiteboard/whiteboard.entity';
import {
  FilterWhiteboard,
  IWhiteboardRepository,
  UpdateWhiteboard,
  WHITEBOARD_REPOSITORY_TOKEN
} from '@domain/repositories/whiteboard/whiteboard.repository';

type UpdateWhiteboardInput = {
  filters: FilterWhiteboard;
  data: UpdateWhiteboard;
};

@Injectable()
export class UpdateWhiteboardUseCase {
  constructor(
    @Inject(WHITEBOARD_REPOSITORY_TOKEN)
    private readonly whiteboardRepository: IWhiteboardRepository
  ) {}

  async execute(input: UpdateWhiteboardInput): Promise<WhiteboardEntity> {
    const { filters, data } = input;

    const existingWhiteboard = await this.whiteboardRepository.findOne(filters);
    if (!existingWhiteboard) {
      throw new Exception(WhiteboardErrorCodes.NOT_FOUND);
    }

    const updatedWhiteboard = await this.whiteboardRepository.update(filters, data);
    if (!updatedWhiteboard) {
      throw new Exception(WhiteboardErrorCodes.NOT_UPDATED);
    }

    return new WhiteboardEntity(updatedWhiteboard);
  }
}
