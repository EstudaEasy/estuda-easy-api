import { Test } from '@nestjs/testing';

import { DiaryErrorCodes, Exception } from '@application/errors';
import { DiaryMock } from '@domain/entities/diary/__mocks__/diary.mock';
import { DIARY_REPOSITORY_TOKEN } from '@domain/repositories/diary/diary.repository';
import { S3Provider } from '@providers/s3/s3.provider';

import { DeleteDiaryUseCase } from '../delete-diary.use-case';

describe('Use Cases -> Diary -> Delete', () => {
  let deleteDiaryUseCase: DeleteDiaryUseCase;

  const diary = new DiaryMock({ audioUrl: undefined });

  const diaryRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  const s3ServiceMock = {
    deleteFile: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteDiaryUseCase,
        {
          provide: DIARY_REPOSITORY_TOKEN,
          useValue: diaryRepositoryMock
        },
        {
          provide: S3Provider,
          useValue: s3ServiceMock
        }
      ]
    }).compile();

    deleteDiaryUseCase = module.get<DeleteDiaryUseCase>(DeleteDiaryUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete diary', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(diary);
    diaryRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: diary.id }
    };

    await deleteDiaryUseCase.execute(input);

    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(diaryRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
    expect(s3ServiceMock.deleteFile).not.toHaveBeenCalled();
  });

  it('should delete diary and remove audio file when exists', async () => {
    const diaryWithAudio = new DiaryMock({
      ...diary,
      audioUrl: 'https://bucket.s3.amazonaws.com/diaries/audios/old.mp3'
    });
    diaryRepositoryMock.findOne.mockResolvedValue(diaryWithAudio);
    diaryRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: diary.id }
    };

    await deleteDiaryUseCase.execute(input);

    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(s3ServiceMock.deleteFile).toHaveBeenCalledWith(diaryWithAudio.audioUrl);
    expect(diaryRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should not delete diary - diary not found', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: diary.id }
    };

    await expect(deleteDiaryUseCase.execute(input)).rejects.toThrow(new Exception(DiaryErrorCodes.NOT_FOUND));
    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(diaryRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete diary - delete failed', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(diary);
    diaryRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: diary.id }
    };

    await expect(deleteDiaryUseCase.execute(input)).rejects.toThrow(new Exception(DiaryErrorCodes.NOT_DELETED));
    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(diaryRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });
});
