import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiaryModel } from '@database/typeorm/models/diary/diary.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DiaryMock } from '@domain/entities/diary/__mocks__/diary.mock';

import { DiaryRepository } from '../diary.repository';

describe('TypeOrm -> Diary Repository -> Find One', () => {
  const diaryMock = new DiaryMock();

  let diaryRepository: DiaryRepository;
  let diaryRepositoryMock: Repository<DiaryModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DiaryRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DiaryModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    diaryRepository = module.get<DiaryRepository>(DiaryRepository);
    diaryRepositoryMock = module.get<Repository<DiaryModel>>(getRepositoryToken(DiaryModel));

    findOneSpy = jest.spyOn(diaryRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(diaryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a diary - diary found', async () => {
    const res = await diaryRepository.findOne({ id: diaryMock.id });

    expect(res).toStrictEqual(diaryMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - diary not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await diaryRepository.findOne({ id: diaryMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
