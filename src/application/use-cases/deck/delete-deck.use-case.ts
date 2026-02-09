import { Inject, Injectable } from '@nestjs/common';

import { DeckErrorCodes, Exception } from '@application/errors';
import { DECK_REPOSITORY_TOKEN, FilterDeck, IDeckRepository } from '@domain/repositories/deck/deck.repository';

type DeleteDeckInput = {
  filters: FilterDeck;
};

@Injectable()
export class DeleteDeckUseCase {
  constructor(
    @Inject(DECK_REPOSITORY_TOKEN)
    private readonly deckRepository: IDeckRepository
  ) {}

  async execute(input: DeleteDeckInput): Promise<void> {
    const { filters } = input;

    const deck = await this.deckRepository.findOne(filters);
    if (!deck) {
      throw new Exception(DeckErrorCodes.NOT_FOUND);
    }

    const deleted = await this.deckRepository.delete(filters);
    if (!deleted) {
      throw new Exception(DeckErrorCodes.NOT_DELETED);
    }
  }
}
