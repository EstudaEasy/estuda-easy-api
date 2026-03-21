import { Inject, Injectable } from '@nestjs/common';

import { FlashcardErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { FlashcardEntity } from '@domain/flashcard/flashcard.entity';
import {
  FilterFlashcard,
  FLASHCARD_REPOSITORY_TOKEN,
  IFlashcardRepository
} from '@domain/flashcard/flashcard.repository';

type FindOneFlashcardInput = {
  filters: FilterFlashcard;
};

@Injectable()
export class FindOneFlashcardUseCase {
  constructor(
    @Inject(FLASHCARD_REPOSITORY_TOKEN)
    private readonly flashcardRepository: IFlashcardRepository
  ) {}

  async execute(input: FindOneFlashcardInput): Promise<FlashcardEntity> {
    const { filters } = input;

    const flashcard = await this.flashcardRepository.findOne(filters);
    if (!flashcard) {
      throw new Exception(FlashcardErrorCodes.NOT_FOUND);
    }

    return new FlashcardEntity(flashcard);
  }
}
