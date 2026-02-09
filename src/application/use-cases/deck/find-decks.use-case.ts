import { Inject, Injectable } from '@nestjs/common';

import { DeckEntity } from '@domain/entities/deck/deck.entity';
import {
  DECK_REPOSITORY_TOKEN,
  FilterDeck,
  IDeckRepository,
  RelationsDeck
} from '@domain/repositories/deck/deck.repository';

type FindDecksInput = {
  filters?: FilterDeck;
  relations?: RelationsDeck;
};

type FindDecksOutput = {
  decks: DeckEntity[];
  total: number;
};

@Injectable()
export class FindDecksUseCase {
  constructor(
    @Inject(DECK_REPOSITORY_TOKEN)
    private readonly deckRepository: IDeckRepository
  ) {}

  async execute(input: FindDecksInput = {}): Promise<FindDecksOutput> {
    const { filters, relations } = input;

    const { decks, total } = await this.deckRepository.find(filters, relations);

    return {
      decks: decks.map((deck) => new DeckEntity(deck)),
      total
    };
  }
}
