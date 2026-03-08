import { Inject, Injectable } from '@nestjs/common';

import { DiaryErrorCodes, Exception } from '@application/errors';
import { DiaryEntity } from '@domain/diary/diary.entity';
import { DIARY_REPOSITORY_TOKEN, FilterDiary, IDiaryRepository, RelationsDiary } from '@domain/diary/diary.repository';

type FindOneDiaryInput = {
  filters: FilterDiary;
  relations?: RelationsDiary;
};

@Injectable()
export class FindOneDiaryUseCase {
  constructor(
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: IDiaryRepository
  ) {}

  async execute(input: FindOneDiaryInput): Promise<DiaryEntity> {
    const { filters, relations } = input;

    const diary = await this.diaryRepository.findOne(filters, relations);
    if (!diary) {
      throw new Exception(DiaryErrorCodes.NOT_FOUND);
    }

    return new DiaryEntity(diary);
  }
}
