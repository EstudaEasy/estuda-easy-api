import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { DiaryModel } from '@database/typeorm/models/diary/diary.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DiaryMock } from '@domain/diary/__mocks__/diary.mock';

import { DiaryRepository } from '../diary.repository';

describe('TypeOrm -> Diary Repository -> Update', () => {
  const diaryMock = new DiaryMock();

  let diaryRepository: DiaryRepository;
  let diaryRepositoryMock: Repository<DiaryModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DiaryRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DiaryModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    diaryRepository = module.get<DiaryRepository>(DiaryRepository);
    diaryRepositoryMock = module.get<Repository<DiaryModel>>(getRepositoryToken(DiaryModel));

    updateSpy = jest.spyOn(diaryRepositoryMock, 'update');
    findOneSpy = jest.spyOn(diaryRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a diary - diary updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(diaryMock);

    const res = await diaryRepository.update({ id: diaryMock.id }, { title: 'Updated Diary' });

    expect(res).toStrictEqual(diaryMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - diary not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await diaryRepository.update({ id: diaryMock.id }, { title: 'Updated Diary' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
