import { Inject, Injectable } from '@nestjs/common';

import { WhiteboardErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { WhiteboardEntity } from '@domain/whiteboard/whiteboard.entity';
import {
  FilterWhiteboard,
  IWhiteboardRepository,
  RelationsWhiteboard,
  WHITEBOARD_REPOSITORY_TOKEN
} from '@domain/whiteboard/whiteboard.repository';

type FindOneWhiteboardInput = {
  filters: FilterWhiteboard;
  relations?: RelationsWhiteboard;
};

@Injectable()
export class FindOneWhiteboardUseCase {
  constructor(
    @Inject(WHITEBOARD_REPOSITORY_TOKEN)
    private readonly whiteboardRepository: IWhiteboardRepository
  ) {}

  async execute(input: FindOneWhiteboardInput): Promise<WhiteboardEntity> {
    const { filters, relations } = input;

    const whiteboard = await this.whiteboardRepository.findOne(filters, relations);
    if (!whiteboard) {
      throw new Exception(WhiteboardErrorCodes.NOT_FOUND);
    }

    return new WhiteboardEntity(whiteboard);
  }
}
