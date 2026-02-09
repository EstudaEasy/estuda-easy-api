import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { FlashcardModel } from '@database/typeorm/models/flashcard/flashcard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';

import { FlashcardRepository } from '../flashcard.repository';

describe('TypeOrm -> Flashcard Repository -> Delete', () => {
  const flashcardMock = new FlashcardMock();

  let flashcardRepository: FlashcardRepository;
  let flashcardRepositoryMock: Repository<FlashcardModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FlashcardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(FlashcardModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    flashcardRepository = module.get<FlashcardRepository>(FlashcardRepository);
    flashcardRepositoryMock = module.get<Repository<FlashcardModel>>(getRepositoryToken(FlashcardModel));

    deleteSpy = jest.spyOn(flashcardRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a flashcard and return true - flashcard found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await flashcardRepository.delete({ id: flashcardMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - flashcard not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await flashcardRepository.delete({ id: flashcardMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
