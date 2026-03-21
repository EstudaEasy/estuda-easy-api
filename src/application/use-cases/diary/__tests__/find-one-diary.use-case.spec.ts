import { Test } from '@nestjs/testing';

import { DiaryErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { DiaryMock } from '@domain/diary/__mocks__/diary.mock';
import { DIARY_REPOSITORY_TOKEN } from '@domain/diary/diary.repository';

import { FindOneDiaryUseCase } from '../find-one-diary.use-case';

describe('Use Cases -> Diary -> Find One', () => {
  let findOneDiaryUseCase: FindOneDiaryUseCase;

  const diary = new DiaryMock();

  const diaryRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneDiaryUseCase,
        {
          provide: DIARY_REPOSITORY_TOKEN,
          useValue: diaryRepositoryMock
        }
      ]
    }).compile();

    findOneDiaryUseCase = module.get<FindOneDiaryUseCase>(FindOneDiaryUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one diary', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(diary);

    const input = {
      filters: { id: diary.id },
      relations: { resource: true }
    };

    const result = await findOneDiaryUseCase.execute(input);

    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(diary);
  });

  it('should not find diary - diary not found', async () => {
    diaryRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: diary.id }
    };

    await expect(findOneDiaryUseCase.execute(input)).rejects.toThrow(new Exception(DiaryErrorCodes.NOT_FOUND));
    expect(diaryRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
