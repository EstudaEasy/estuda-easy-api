import { Inject, Injectable } from '@nestjs/common';

import { DeckErrorCodes, Exception } from '@application/errors';
import { DeckEntity } from '@domain/entities/deck/deck.entity';
import {
  DECK_REPOSITORY_TOKEN,
  FilterDeck,
  IDeckRepository,
  RelationsDeck
} from '@domain/repositories/deck/deck.repository';

type FindOneDeckInput = {
  filters: FilterDeck;
  relations?: RelationsDeck;
};

@Injectable()
export class FindOneDeckUseCase {
  constructor(
    @Inject(DECK_REPOSITORY_TOKEN)
    private readonly deckRepository: IDeckRepository
  ) {}

  async execute(input: FindOneDeckInput): Promise<DeckEntity> {
    const { filters, relations } = input;

    const deck = await this.deckRepository.findOne(filters, relations);
    if (!deck) {
      throw new Exception(DeckErrorCodes.NOT_FOUND);
    }

    return new DeckEntity(deck);
  }
}
