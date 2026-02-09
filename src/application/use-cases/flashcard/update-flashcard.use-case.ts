import { Inject, Injectable } from '@nestjs/common';

import { FlashcardErrorCodes, Exception } from '@application/errors';
import { FlashcardEntity } from '@domain/entities/flashcard/flashcard.entity';
import {
  FilterFlashcard,
  FLASHCARD_REPOSITORY_TOKEN,
  IFlashcardRepository,
  UpdateFlashcard
} from '@domain/repositories/flashcard/flashcard.repository';

type UpdateFlashcardInput = {
  filters: FilterFlashcard;
  data: UpdateFlashcard;
};

@Injectable()
export class UpdateFlashcardUseCase {
  constructor(
    @Inject(FLASHCARD_REPOSITORY_TOKEN)
    private readonly flashcardRepository: IFlashcardRepository
  ) {}

  async execute(input: UpdateFlashcardInput): Promise<FlashcardEntity> {
    const { filters, data } = input;

    const existingFlashcard = await this.flashcardRepository.findOne(filters);
    if (!existingFlashcard) {
      throw new Exception(FlashcardErrorCodes.NOT_FOUND);
    }

    const updatedFlashcard = await this.flashcardRepository.update(filters, data);
    if (!updatedFlashcard) {
      throw new Exception(FlashcardErrorCodes.NOT_UPDATED);
    }

    return new FlashcardEntity(updatedFlashcard);
  }
}
