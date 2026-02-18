import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiaryModel } from '@database/typeorm/models/diary/diary.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DiaryMock } from '@domain/entities/diary/__mocks__/diary.mock';

import { DiaryRepository } from '../diary.repository';

describe('TypeOrm -> Diary Repository -> Find', () => {
  const diaryMocks = DiaryMock.getList(3);

  let diaryRepository: DiaryRepository;
  let diaryRepositoryMock: Repository<DiaryModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DiaryRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DiaryModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    diaryRepository = module.get<DiaryRepository>(DiaryRepository);
    diaryRepositoryMock = module.get<Repository<DiaryModel>>(getRepositoryToken(DiaryModel));

    findAndCountSpy = jest.spyOn(diaryRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return diaries with count', async () => {
    findAndCountSpy.mockResolvedValue([diaryMocks, diaryMocks.length]);

    const res = await diaryRepository.find();

    expect(res).toEqual({ diaries: diaryMocks, total: 3 });
    expect(res.diaries).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no diaries found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await diaryRepository.find();

    expect(res).toEqual({ diaries: [], total: 0 });
    expect(res.diaries).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
