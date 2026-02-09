import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { FlashcardModel } from '@database/typeorm/models/flashcard/flashcard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';

import { FlashcardRepository } from '../flashcard.repository';

describe('TypeOrm -> Flashcard Repository -> Create', () => {
  const flashcardMock = new FlashcardMock();

  let flashcardRepository: FlashcardRepository;
  let flashcardRepositoryMock: Repository<FlashcardModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FlashcardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(FlashcardModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    flashcardRepository = module.get<FlashcardRepository>(FlashcardRepository);
    flashcardRepositoryMock = module.get<Repository<FlashcardModel>>(getRepositoryToken(FlashcardModel));

    createSpy = jest.spyOn(flashcardRepositoryMock, 'create');
    createSpy.mockReturnValue(flashcardMock);

    saveSpy = jest.spyOn(flashcardRepositoryMock, 'save');
    saveSpy.mockResolvedValue(flashcardMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a flashcard', async () => {
    const res = await flashcardRepository.create({
      deckId: flashcardMock.deckId,
      front: flashcardMock.front,
      back: flashcardMock.back,
      position: flashcardMock.position
    });

    expect(res).toStrictEqual(flashcardMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
