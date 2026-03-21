import { Test } from '@nestjs/testing';

import { DiaryMock } from '@domain/diary/__mocks__/diary.mock';
import { DIARY_REPOSITORY_TOKEN } from '@domain/diary/diary.repository';

import { FindDiariesUseCase } from '../find-diaries.use-case';

describe('Use Cases -> Diary -> Find', () => {
  let findDiariesUseCase: FindDiariesUseCase;

  const diaries = DiaryMock.getList(3);

  const diaryRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindDiariesUseCase,
        {
          provide: DIARY_REPOSITORY_TOKEN,
          useValue: diaryRepositoryMock
        }
      ]
    }).compile();

    findDiariesUseCase = module.get<FindDiariesUseCase>(FindDiariesUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find diaries', async () => {
    diaryRepositoryMock.find.mockResolvedValue({ diaries, total: diaries.length });

    const input = {
      filters: { title: 'Meu diário' },
      relations: { resource: true }
    };

    const result = await findDiariesUseCase.execute(input);

    expect(diaryRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.diaries).toHaveLength(3);
    expect(result.total).toBe(3);
  });

  it('should find diaries without filters', async () => {
    diaryRepositoryMock.find.mockResolvedValue({ diaries, total: diaries.length });

    const result = await findDiariesUseCase.execute();

    expect(diaryRepositoryMock.find).toHaveBeenCalledWith(undefined, undefined);
    expect(result.diaries).toHaveLength(3);
    expect(result.total).toBe(3);
  });
});
