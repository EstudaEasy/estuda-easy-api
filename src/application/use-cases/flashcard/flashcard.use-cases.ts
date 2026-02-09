import { Module } from '@nestjs/common';

import { FlashcardRepositoryModule } from '@database/typeorm/repository/flashcard/flashcard.repository';

import { CreateFlashcardUseCase } from './create-flashcard.use-case';
import { DeleteFlashcardUseCase } from './delete-flashcard.use-case';
import { FindFlashcardsUseCase } from './find-flashcards.use-case';
import { FindOneFlashcardUseCase } from './find-one-flashcard.use-case';
import { UpdateFlashcardUseCase } from './update-flashcard.use-case';

@Module({
  imports: [FlashcardRepositoryModule],
  providers: [
    CreateFlashcardUseCase,
    FindFlashcardsUseCase,
    FindOneFlashcardUseCase,
    UpdateFlashcardUseCase,
    DeleteFlashcardUseCase
  ],
  exports: [
    CreateFlashcardUseCase,
    FindFlashcardsUseCase,
    FindOneFlashcardUseCase,
    UpdateFlashcardUseCase,
    DeleteFlashcardUseCase
  ]
})
export class FlashcardUseCasesModule {}
