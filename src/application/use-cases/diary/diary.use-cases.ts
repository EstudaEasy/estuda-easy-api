import { Module } from '@nestjs/common';

import { DiaryRepositoryModule } from '@database/typeorm/repository/diary/diary.repository';
import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';

import { CreateDiaryUseCase } from './create-diary.use-case';
import { DeleteDiaryUseCase } from './delete-diary.use-case';
import { FindDiariesUseCase } from './find-diaries.use-case';
import { FindOneDiaryUseCase } from './find-one-diary.use-case';
import { UpdateDiaryUseCase } from './update-diary.use-case';

@Module({
  imports: [DiaryRepositoryModule, ResourceRepositoryModule],
  providers: [CreateDiaryUseCase, FindDiariesUseCase, FindOneDiaryUseCase, UpdateDiaryUseCase, DeleteDiaryUseCase],
  exports: [CreateDiaryUseCase, FindDiariesUseCase, FindOneDiaryUseCase, UpdateDiaryUseCase, DeleteDiaryUseCase]
})
export class DiaryUseCasesModule {}
