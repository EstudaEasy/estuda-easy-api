import { Inject, Injectable } from '@nestjs/common';

import { FlashcardEntity } from '@domain/entities/flashcard/flashcard.entity';
import {
  FilterFlashcard,
  FLASHCARD_REPOSITORY_TOKEN,
  IFlashcardRepository
} from '@domain/repositories/flashcard/flashcard.repository';

type FindFlashcardsInput = {
  filters?: FilterFlashcard;
};

type FindFlashcardsOutput = {
  flashcards: FlashcardEntity[];
  total: number;
};

@Injectable()
export class FindFlashcardsUseCase {
  constructor(
    @Inject(FLASHCARD_REPOSITORY_TOKEN)
    private readonly flashcardRepository: IFlashcardRepository
  ) {}

  async execute(input: FindFlashcardsInput = {}): Promise<FindFlashcardsOutput> {
    const { filters } = input;

    const { flashcards, total } = await this.flashcardRepository.find(filters);

    return {
      flashcards: flashcards.map((flashcard) => new FlashcardEntity(flashcard)),
      total
    };
  }
}
