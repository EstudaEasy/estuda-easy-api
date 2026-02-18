import { Inject, Injectable } from '@nestjs/common';

import { DiaryErrorCodes, Exception } from '@application/errors';
import { DIARY_REPOSITORY_TOKEN, FilterDiary, IDiaryRepository } from '@domain/repositories/diary/diary.repository';

type DeleteDiaryInput = {
  filters: FilterDiary;
};

@Injectable()
export class DeleteDiaryUseCase {
  constructor(
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: IDiaryRepository
  ) {}

  async execute(input: DeleteDiaryInput): Promise<void> {
    const { filters } = input;

    const diary = await this.diaryRepository.findOne(filters);
    if (!diary) {
      throw new Exception(DiaryErrorCodes.NOT_FOUND);
    }

    const deleted = await this.diaryRepository.delete(filters);
    if (!deleted) {
      throw new Exception(DiaryErrorCodes.NOT_DELETED);
    }
  }
}
