import { Inject, Injectable } from '@nestjs/common';

import { DiaryEntity } from '@domain/diary/diary.entity';
import { DIARY_REPOSITORY_TOKEN, FilterDiary, IDiaryRepository, RelationsDiary } from '@domain/diary/diary.repository';

type FindDiariesInput = {
  filters?: FilterDiary;
  relations?: RelationsDiary;
};

type FindDiariesOutput = {
  diaries: DiaryEntity[];
  total: number;
};

@Injectable()
export class FindDiariesUseCase {
  constructor(
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: IDiaryRepository
  ) {}

  async execute(input: FindDiariesInput = {}): Promise<FindDiariesOutput> {
    const { filters, relations } = input;

    const { diaries, total } = await this.diaryRepository.find(filters, relations);

    return {
      diaries: diaries.map((diary) => new DiaryEntity(diary)),
      total
    };
  }
}
