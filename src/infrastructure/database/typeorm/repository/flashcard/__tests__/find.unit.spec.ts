import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FlashcardModel } from '@database/typeorm/models/flashcard/flashcard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';

import { FlashcardRepository } from '../flashcard.repository';

describe('TypeOrm -> Flashcard Repository -> Find', () => {
  const flashcardMocks = FlashcardMock.getList(3);

  let flashcardRepository: FlashcardRepository;
  let flashcardRepositoryMock: Repository<FlashcardModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FlashcardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(FlashcardModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    flashcardRepository = module.get<FlashcardRepository>(FlashcardRepository);
    flashcardRepositoryMock = module.get<Repository<FlashcardModel>>(getRepositoryToken(FlashcardModel));

    findAndCountSpy = jest.spyOn(flashcardRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return flashcards with count', async () => {
    findAndCountSpy.mockResolvedValue([flashcardMocks, flashcardMocks.length]);

    const res = await flashcardRepository.find();

    expect(res).toEqual({ flashcards: flashcardMocks, total: 3 });
    expect(res.flashcards).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no flashcards found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await flashcardRepository.find();

    expect(res).toEqual({ flashcards: [], total: 0 });
    expect(res.flashcards).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
