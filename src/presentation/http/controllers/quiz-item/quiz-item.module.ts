import { Module } from '@nestjs/common';

import { QuizItemUseCasesModule } from '@application/use-cases/quiz-item/quiz-item.use-cases';
import { QuizItemController } from '@presentation/http/controllers/quiz-item/quiz-item.controller';

@Module({
  imports: [QuizItemUseCasesModule],
  controllers: [QuizItemController]
})
export class QuizItemModule {}
