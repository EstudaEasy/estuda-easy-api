import { Module } from '@nestjs/common';

import { FlashcardUseCasesModule } from '@application/use-cases/flashcard/flashcard.use-cases';
import { FlashcardController } from '@presentation/http/controllers/flashcard/flashcard.controller';

@Module({
  imports: [FlashcardUseCasesModule],
  controllers: [FlashcardController]
})
export class FlashcardModule {}
