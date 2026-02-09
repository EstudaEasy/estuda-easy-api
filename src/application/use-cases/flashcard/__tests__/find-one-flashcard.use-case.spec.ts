import { Test } from '@nestjs/testing';

import { FlashcardErrorCodes, Exception } from '@application/errors';
import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';
import { FLASHCARD_REPOSITORY_TOKEN } from '@domain/repositories/flashcard/flashcard.repository';

import { FindOneFlashcardUseCase } from '../find-one-flashcard.use-case';

describe('Use Cases -> Flashcard -> Find One', () => {
  let findOneFlashcardUseCase: FindOneFlashcardUseCase;

  const flashcard = new FlashcardMock();

  const flashcardRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneFlashcardUseCase,
        {
          provide: FLASHCARD_REPOSITORY_TOKEN,
          useValue: flashcardRepositoryMock
        }
      ]
    }).compile();

    findOneFlashcardUseCase = module.get<FindOneFlashcardUseCase>(FindOneFlashcardUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one flashcard', async () => {
    flashcardRepositoryMock.findOne.mockResolvedValue(flashcard);

    const input = {
      filters: { id: flashcard.id }
    };

    const result = await findOneFlashcardUseCase.execute(input);

    expect(flashcardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(result).toEqual(flashcard);
  });

  it('should not find flashcard - flashcard not found', async () => {
    flashcardRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: flashcard.id }
    };

    await expect(findOneFlashcardUseCase.execute(input)).rejects.toThrow(new Exception(FlashcardErrorCodes.NOT_FOUND));
    expect(flashcardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
  });
});
