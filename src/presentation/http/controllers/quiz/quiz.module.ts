import { Module } from '@nestjs/common';

import { QuizUseCasesModule } from '@application/use-cases/quiz/quiz.use-cases';
import { QuizController } from '@presentation/http/controllers/quiz/quiz.controller';

@Module({
  imports: [QuizUseCasesModule],
  controllers: [QuizController]
})
export class QuizModule {}
