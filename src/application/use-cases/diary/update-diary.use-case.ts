import { Inject, Injectable } from '@nestjs/common';

import { DiaryErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { DiaryEntity } from '@domain/diary/diary.entity';
import { DIARY_REPOSITORY_TOKEN, FilterDiary, IDiaryRepository, UpdateDiary } from '@domain/diary/diary.repository';

type UpdateDiaryInput = {
  filters: FilterDiary;
  data: UpdateDiary;
};

@Injectable()
export class UpdateDiaryUseCase {
  constructor(
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: IDiaryRepository
  ) {}

  async execute(input: UpdateDiaryInput): Promise<DiaryEntity> {
    const { filters, data } = input;

    const existingDiary = await this.diaryRepository.findOne(filters);
    if (!existingDiary) {
      throw new Exception(DiaryErrorCodes.NOT_FOUND);
    }

    const updatedDiary = await this.diaryRepository.update(filters, data);
    if (!updatedDiary) {
      throw new Exception(DiaryErrorCodes.NOT_UPDATED);
    }

    return new DiaryEntity(updatedDiary);
  }
}
