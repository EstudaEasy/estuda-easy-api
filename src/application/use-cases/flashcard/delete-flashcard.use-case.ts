import { Inject, Injectable } from '@nestjs/common';

import { FlashcardErrorCodes, Exception } from '@application/errors';
import {
  FilterFlashcard,
  FLASHCARD_REPOSITORY_TOKEN,
  IFlashcardRepository
} from '@domain/repositories/flashcard/flashcard.repository';

type DeleteFlashcardInput = {
  filters: FilterFlashcard;
};

@Injectable()
export class DeleteFlashcardUseCase {
  constructor(
    @Inject(FLASHCARD_REPOSITORY_TOKEN)
    private readonly flashcardRepository: IFlashcardRepository
  ) {}

  async execute(input: DeleteFlashcardInput): Promise<void> {
    const { filters } = input;

    const flashcard = await this.flashcardRepository.findOne(filters);
    if (!flashcard) {
      throw new Exception(FlashcardErrorCodes.NOT_FOUND);
    }

    const deleted = await this.flashcardRepository.delete(filters);
    if (!deleted) {
      throw new Exception(FlashcardErrorCodes.NOT_DELETED);
    }
  }
}
