import { Module } from '@nestjs/common';

import { AIModule } from '@adapters/ai/ai.module';
import { DeckRepositoryModule } from '@database/typeorm/repository/deck/deck.repository';
import { DiaryRepositoryModule } from '@database/typeorm/repository/diary/diary.repository';
import { QuizRepositoryModule } from '@database/typeorm/repository/quiz/quiz.repository';
import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';

import { ConvertResourceUseCase } from './convert-resource.use-case';

@Module({
  imports: [AIModule, ResourceRepositoryModule, DiaryRepositoryModule, QuizRepositoryModule, DeckRepositoryModule],
  providers: [ConvertResourceUseCase],
  exports: [ConvertResourceUseCase]
})
export class ResourceConversionUseCasesModule {}
