import { Inject, Injectable } from '@nestjs/common';

import { Exception, WhiteboardErrorCodes } from '@application/errors';
import {
  FilterWhiteboard,
  IWhiteboardRepository,
  WHITEBOARD_REPOSITORY_TOKEN
} from '@domain/repositories/whiteboard/whiteboard.repository';

type DeleteWhiteboardInput = {
  filters: FilterWhiteboard;
};

@Injectable()
export class DeleteWhiteboardUseCase {
  constructor(
    @Inject(WHITEBOARD_REPOSITORY_TOKEN)
    private readonly whiteboardRepository: IWhiteboardRepository
  ) {}

  async execute(input: DeleteWhiteboardInput): Promise<void> {
    const { filters } = input;

    const whiteboard = await this.whiteboardRepository.findOne(filters);
    if (!whiteboard) {
      throw new Exception(WhiteboardErrorCodes.NOT_FOUND);
    }

    const deleted = await this.whiteboardRepository.delete(filters);
    if (!deleted) {
      throw new Exception(WhiteboardErrorCodes.NOT_DELETED);
    }
  }
}
