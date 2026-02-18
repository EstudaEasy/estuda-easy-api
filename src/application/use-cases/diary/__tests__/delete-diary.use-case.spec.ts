import { Test } from '@nestjs/testing';

import { DiaryErrorCodes, Exception } from '@application/errors';
import { DiaryMock } from '@domain/entities/diary/__mocks__/diary.mock';
import { DIARY_REPOSITORY_TOKEN } from '@domain/repositories/diary/diary.repository';

import { DeleteDiaryUseCase } from '../delete-diary.use-case';

describe('Use Cases -> Diary -> Delete', () => {
  let deleteDiaryUseCase: DeleteDiaryUseCase;

  const diary = new DiaryMock();

  const diaryRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteDiaryUseCase,
        {
          provide: DIARY_REPOSITORY_TOKEN,
          useValue: diaryRepositoryMock
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
