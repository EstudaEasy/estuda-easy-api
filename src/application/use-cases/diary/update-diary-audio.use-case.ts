import { randomUUID } from 'crypto';
import { extname } from 'path';

import { Inject, Injectable } from '@nestjs/common';

import { DiaryErrorCodes, Exception } from '@application/errors';
import { DiaryEntity } from '@domain/entities/diary/diary.entity';
import { DIARY_REPOSITORY_TOKEN, FilterDiary, IDiaryRepository } from '@domain/repositories/diary/diary.repository';
import { S3Provider } from '@providers/s3/s3.provider';
import { STORAGE_PATHS } from '@shared/constants';

type UpdateDiaryAudioInput = {
  filters: FilterDiary;
  file: Express.Multer.File;
};

@Injectable()
export class UpdateDiaryAudioUseCase {
  constructor(
    @Inject(DIARY_REPOSITORY_TOKEN)
    private readonly diaryRepository: IDiaryRepository,
    private readonly s3Service: S3Provider
  ) {}

  async execute(input: UpdateDiaryAudioInput): Promise<DiaryEntity> {
    const { filters, file } = input;

    const diary = await this.diaryRepository.findOne(filters);
    if (!diary) {
      throw new Exception(DiaryErrorCodes.NOT_FOUND);
    }

    if (diary.audioUrl) {
      await this.s3Service.deleteFile(diary.audioUrl);
    }

    const fileExtension = extname(file.originalname);
    const fileKey = `${STORAGE_PATHS.diaries.audios}/${randomUUID()}${fileExtension}`;

    const { url: audioUrl } = await this.s3Service.uploadFile(fileKey, file.buffer, file.mimetype);

    const updatedDiary = await this.diaryRepository.update(filters, { audioUrl });
    if (!updatedDiary) {
      throw new Exception(DiaryErrorCodes.NOT_UPDATED);
    }

    return new DiaryEntity(updatedDiary);
  }
}
