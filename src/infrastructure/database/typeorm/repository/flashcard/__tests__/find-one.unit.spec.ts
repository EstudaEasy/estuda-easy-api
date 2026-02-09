import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FlashcardModel } from '@database/typeorm/models/flashcard/flashcard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';

import { FlashcardRepository } from '../flashcard.repository';

describe('TypeOrm -> Flashcard Repository -> Find One', () => {
  const flashcardMock = new FlashcardMock();

  let flashcardRepository: FlashcardRepository;
  let flashcardRepositoryMock: Repository<FlashcardModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FlashcardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(FlashcardModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    flashcardRepository = module.get<FlashcardRepository>(FlashcardRepository);
    flashcardRepositoryMock = module.get<Repository<FlashcardModel>>(getRepositoryToken(FlashcardModel));

    findOneSpy = jest.spyOn(flashcardRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(flashcardMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a flashcard - flashcard found', async () => {
    const res = await flashcardRepository.findOne({ id: flashcardMock.id });

    expect(res).toStrictEqual(flashcardMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - flashcard not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await flashcardRepository.findOne({ id: flashcardMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
