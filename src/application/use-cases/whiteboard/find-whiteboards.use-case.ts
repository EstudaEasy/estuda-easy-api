import { Inject, Injectable } from '@nestjs/common';

import { WhiteboardEntity } from '@domain/entities/whiteboard/whiteboard.entity';
import {
  FilterWhiteboard,
  IWhiteboardRepository,
  RelationsWhiteboard,
  WHITEBOARD_REPOSITORY_TOKEN
} from '@domain/repositories/whiteboard/whiteboard.repository';

type FindWhiteboardsInput = {
  filters?: FilterWhiteboard;
  relations?: RelationsWhiteboard;
};

type FindWhiteboardsOutput = {
  whiteboards: WhiteboardEntity[];
  total: number;
};

@Injectable()
export class FindWhiteboardsUseCase {
  constructor(
    @Inject(WHITEBOARD_REPOSITORY_TOKEN)
    private readonly whiteboardRepository: IWhiteboardRepository
  ) {}

  async execute(input: FindWhiteboardsInput = {}): Promise<FindWhiteboardsOutput> {
    const { filters, relations } = input;

    const { whiteboards, total } = await this.whiteboardRepository.find(filters, relations);

    return {
      whiteboards: whiteboards.map((whiteboard) => new WhiteboardEntity(whiteboard)),
      total
    };
  }
}
