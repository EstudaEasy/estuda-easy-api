import { Module } from '@nestjs/common';

import { ResourcePermissionService } from '@application/services/resource/resource-permission.service';
import { QuizRepositoryModule } from '@database/typeorm/repository/quiz/quiz.repository';
import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';

import { CreateQuizUseCase } from './create-quiz.use-case';
import { DeleteQuizUseCase } from './delete-quiz.use-case';
import { FindOneQuizUseCase } from './find-one-quiz.use-case';
import { FindQuizzesUseCase } from './find-quizzes.use-case';
import { UpdateQuizUseCase } from './update-quiz.use-case';

@Module({
  imports: [QuizRepositoryModule, ResourceRepositoryModule],
  providers: [
    CreateQuizUseCase,
    FindQuizzesUseCase,
    FindOneQuizUseCase,
    UpdateQuizUseCase,
    DeleteQuizUseCase,
    ResourcePermissionService
  ],
  exports: [CreateQuizUseCase, FindQuizzesUseCase, FindOneQuizUseCase, UpdateQuizUseCase, DeleteQuizUseCase]
})
export class QuizUseCasesModule {}
