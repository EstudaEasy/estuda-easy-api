import { Module } from '@nestjs/common';

import { QuizItemRepositoryModule } from '@database/typeorm/repository/quiz-item/quiz-item.repository';

import { CreateQuizItemUseCase } from './create-quiz-item.use-case';
import { DeleteQuizItemUseCase } from './delete-quiz-item.use-case';
import { FindOneQuizItemUseCase } from './find-one-quiz-item.use-case';
import { FindQuizItemsUseCase } from './find-quiz-items.use-case';
import { UpdateQuizItemUseCase } from './update-quiz-item.use-case';

@Module({
  imports: [QuizItemRepositoryModule],
  providers: [
    CreateQuizItemUseCase,
    FindQuizItemsUseCase,
    FindOneQuizItemUseCase,
    UpdateQuizItemUseCase,
    DeleteQuizItemUseCase
  ],
  exports: [
    CreateQuizItemUseCase,
    FindQuizItemsUseCase,
    FindOneQuizItemUseCase,
    UpdateQuizItemUseCase,
    DeleteQuizItemUseCase
  ]
})
export class QuizItemUseCasesModule {}
