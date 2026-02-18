import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { DiaryModel } from '@database/typeorm/models/diary/diary.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DiaryMock } from '@domain/entities/diary/__mocks__/diary.mock';

import { DiaryRepository } from '../diary.repository';

describe('TypeOrm -> Diary Repository -> Delete', () => {
  const diaryMock = new DiaryMock();

  let diaryRepository: DiaryRepository;
  let diaryRepositoryMock: Repository<DiaryModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DiaryRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DiaryModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    diaryRepository = module.get<DiaryRepository>(DiaryRepository);
    diaryRepositoryMock = module.get<Repository<DiaryModel>>(getRepositoryToken(DiaryModel));

    deleteSpy = jest.spyOn(diaryRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a diary and return true - diary found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await diaryRepository.delete({ id: diaryMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - diary not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await diaryRepository.delete({ id: diaryMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
