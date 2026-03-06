import { Module } from '@nestjs/common';

import { S3Module } from '@adapters/aws/s3/s3.module';
import { DiaryRepositoryModule } from '@database/typeorm/repository/diary/diary.repository';
import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';

import { CreateDiaryUseCase } from './create-diary.use-case';
import { DeleteDiaryUseCase } from './delete-diary.use-case';
import { FindDiariesUseCase } from './find-diaries.use-case';
import { FindOneDiaryUseCase } from './find-one-diary.use-case';
import { UpdateDiaryAudioUseCase } from './update-diary-audio.use-case';
import { UpdateDiaryUseCase } from './update-diary.use-case';

@Module({
  imports: [DiaryRepositoryModule, ResourceRepositoryModule, S3Module],
  providers: [
    CreateDiaryUseCase,
    FindDiariesUseCase,
    FindOneDiaryUseCase,
    UpdateDiaryUseCase,
    UpdateDiaryAudioUseCase,
    DeleteDiaryUseCase
  ],
  exports: [
    CreateDiaryUseCase,
    FindDiariesUseCase,
    FindOneDiaryUseCase,
    UpdateDiaryUseCase,
    UpdateDiaryAudioUseCase,
    DeleteDiaryUseCase
  ]
})
export class DiaryUseCasesModule {}
