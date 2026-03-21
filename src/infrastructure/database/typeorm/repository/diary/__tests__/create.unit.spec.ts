import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DiaryModel } from '@database/typeorm/models/diary/diary.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DiaryMock } from '@domain/diary/__mocks__/diary.mock';

import { DiaryRepository } from '../diary.repository';

describe('TypeOrm -> Diary Repository -> Create', () => {
  const diaryMock = new DiaryMock();

  let diaryRepository: DiaryRepository;
  let diaryRepositoryMock: Repository<DiaryModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DiaryRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DiaryModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    diaryRepository = module.get<DiaryRepository>(DiaryRepository);
    diaryRepositoryMock = module.get<Repository<DiaryModel>>(getRepositoryToken(DiaryModel));

    createSpy = jest.spyOn(diaryRepositoryMock, 'create');
    createSpy.mockReturnValue(diaryMock);

    saveSpy = jest.spyOn(diaryRepositoryMock, 'save');
    saveSpy.mockResolvedValue(diaryMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a diary', async () => {
    const res = await diaryRepository.create({
      title: diaryMock.title,
      content: diaryMock.content,
      audioUrl: diaryMock.audioUrl
    });

    expect(res).toStrictEqual(diaryMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
