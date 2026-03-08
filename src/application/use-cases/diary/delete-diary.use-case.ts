import { Inject, Injectable } from '@nestjs/common';

import { DiaryErrorCodes, Exception } from '@application/errors';
import { DIARY_REPOSITORY_TOKEN, FilterDiary, IDiaryRepository } from '@domain/diary/diary.repository';
import { S3Provider } from '@providers/s3/s3.provider';

type DeleteDiaryInput = {
  filters: FilterDiary;
};

@Injectable()
export class DeleteDiaryUseCase {
  constructor(
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: IDiaryRepository,
    private readonly s3Service: S3Provider
  ) {}

  async execute(input: DeleteDiaryInput): Promise<void> {
    const { filters } = input;

    const diary = await this.diaryRepository.findOne(filters);
    if (!diary) {
      throw new Exception(DiaryErrorCodes.NOT_FOUND);
    }

    if (diary.audioUrl) {
      await this.s3Service.deleteFile(diary.audioUrl);
    }

    const deleted = await this.diaryRepository.delete(filters);
    if (!deleted) {
      throw new Exception(DiaryErrorCodes.NOT_DELETED);
    }
  }
}
