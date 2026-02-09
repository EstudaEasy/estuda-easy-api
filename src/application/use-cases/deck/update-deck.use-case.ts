import { Inject, Injectable } from '@nestjs/common';

import { DeckErrorCodes, Exception } from '@application/errors';
import { DeckEntity } from '@domain/entities/deck/deck.entity';
import {
  DECK_REPOSITORY_TOKEN,
  FilterDeck,
  IDeckRepository,
  UpdateDeck
} from '@domain/repositories/deck/deck.repository';

type UpdateDeckInput = {
  filters: FilterDeck;
  data: UpdateDeck;
};

@Injectable()
export class UpdateDeckUseCase {
  constructor(
    @Inject(DECK_REPOSITORY_TOKEN)
    private readonly deckRepository: IDeckRepository
  ) {}

  async execute(input: UpdateDeckInput): Promise<DeckEntity> {
    const { filters, data } = input;

    const existingDeck = await this.deckRepository.findOne(filters);
    if (!existingDeck) {
      throw new Exception(DeckErrorCodes.NOT_FOUND);
    }

    const updatedDeck = await this.deckRepository.update(filters, data);
    if (!updatedDeck) {
      throw new Exception(DeckErrorCodes.NOT_UPDATED);
    }

    return new DeckEntity(updatedDeck);
  }
}
