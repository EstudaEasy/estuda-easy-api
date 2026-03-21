import { Test } from '@nestjs/testing';

import { DiaryErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { DiaryMock } from '@domain/diary/__mocks__/diary.mock';
import { DIARY_REPOSITORY_TOKEN } from '@domain/diary/diary.repository';

import { UpdateDiaryUseCase } from '../update-diary.use-case';

describe('Use Cases -> Diary -> Update', () => {
  let updateDiaryUseCase: UpdateDiaryUseCase;

  const diary = new DiaryMock();
  const updatedDiary = new DiaryMock({ ...diary, title: 'Updated Diary' });

  const diaryRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateDiaryUseCase,
        {
          provide: DIARY_REPOSITORY_TOKEN,
          useValue: diaryRepositoryMock
        }
      ]
    }).compile();

    updateDiaryUseCase = module.get<UpdateDiaryUseCase>(UpdateDiaryUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update diary', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(diary);
    diaryRepositoryMock.update.mockResolvedValue(updatedDiary);

    const input = {
      filters: { id: diary.id },
      data: { title: 'Updated Diary' }
    };

    const result = await updateDiaryUseCase.execute(input);

    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(diaryRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(updatedDiary);
  });

  it('should not update diary - diary not found', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: diary.id },
      data: { title: 'Updated Diary' }
    };

    await expect(updateDiaryUseCase.execute(input)).rejects.toThrow(new Exception(DiaryErrorCodes.NOT_FOUND));
    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(diaryRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update diary - update failed', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(diary);
    diaryRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: diary.id },
      data: { title: 'Updated Diary' }
    };

    await expect(updateDiaryUseCase.execute(input)).rejects.toThrow(new Exception(DiaryErrorCodes.NOT_UPDATED));
    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(diaryRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
  });
});
