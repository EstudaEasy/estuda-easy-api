import { Inject, Injectable } from '@nestjs/common';

import { FlashcardEntity } from '@domain/entities/flashcard/flashcard.entity';
import {
  CreateFlashcard,
  FLASHCARD_REPOSITORY_TOKEN,
  IFlashcardRepository
} from '@domain/repositories/flashcard/flashcard.repository';

export interface CreateFlashcardInput {
  data: CreateFlashcard;
}

@Injectable()
export class CreateFlashcardUseCase {
  constructor(
    @Inject(FLASHCARD_REPOSITORY_TOKEN)
    private readonly flashcardRepository: IFlashcardRepository
  ) {}

  async execute(input: CreateFlashcardInput): Promise<FlashcardEntity> {
    const { data } = input;

    const flashcard = await this.flashcardRepository.create(data);

    return new FlashcardEntity(flashcard);
  }
}
