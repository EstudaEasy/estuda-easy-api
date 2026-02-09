import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { FlashcardModel } from '@database/typeorm/models/flashcard/flashcard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';

import { FlashcardRepository } from '../flashcard.repository';

describe('TypeOrm -> Flashcard Repository -> Update', () => {
  const flashcardMock = new FlashcardMock();

  let flashcardRepository: FlashcardRepository;
  let flashcardRepositoryMock: Repository<FlashcardModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FlashcardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(FlashcardModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    flashcardRepository = module.get<FlashcardRepository>(FlashcardRepository);
    flashcardRepositoryMock = module.get<Repository<FlashcardModel>>(getRepositoryToken(FlashcardModel));

    updateSpy = jest.spyOn(flashcardRepositoryMock, 'update');
    findOneSpy = jest.spyOn(flashcardRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a flashcard - flashcard updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(flashcardMock);

    const res = await flashcardRepository.update({ id: flashcardMock.id }, { front: 'Updated Front' });

    expect(res).toStrictEqual(flashcardMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - flashcard not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await flashcardRepository.update({ id: flashcardMock.id }, { front: 'Updated Front' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
