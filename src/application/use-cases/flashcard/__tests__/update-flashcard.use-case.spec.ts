import { Test } from '@nestjs/testing';

import { FlashcardErrorCodes, Exception } from '@application/errors';
import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';
import { FLASHCARD_REPOSITORY_TOKEN } from '@domain/repositories/flashcard/flashcard.repository';

import { UpdateFlashcardUseCase } from '../update-flashcard.use-case';

describe('Use Cases -> Flashcard -> Update', () => {
  let updateFlashcardUseCase: UpdateFlashcardUseCase;

  const flashcard = new FlashcardMock();

  const flashcardRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateFlashcardUseCase,
        {
          provide: FLASHCARD_REPOSITORY_TOKEN,
          useValue: flashcardRepositoryMock
        }
      ]
    }).compile();

    updateFlashcardUseCase = module.get<UpdateFlashcardUseCase>(UpdateFlashcardUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update flashcard', async () => {
    flashcardRepositoryMock.findOne.mockResolvedValue(flashcard);
    flashcardRepositoryMock.update.mockResolvedValue(flashcard);

    const input = {
      filters: { id: flashcard.id },
      data: {
        front: 'Updated Front',
        back: 'Updated Back'
      }
    };

    const result = await updateFlashcardUseCase.execute(input);

    expect(flashcardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(flashcardRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(flashcard);
  });

  it('should not update - flashcard not found', async () => {
    flashcardRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: flashcard.id },
      data: { front: 'Updated Front' }
    };

    await expect(updateFlashcardUseCase.execute(input)).rejects.toThrow(new Exception(FlashcardErrorCodes.NOT_FOUND));
    expect(flashcardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(flashcardRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - update failed', async () => {
    flashcardRepositoryMock.findOne.mockResolvedValue(flashcard);
    flashcardRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: flashcard.id },
      data: { front: 'Updated Front' }
    };

    await expect(updateFlashcardUseCase.execute(input)).rejects.toThrow(new Exception(FlashcardErrorCodes.NOT_UPDATED));
    expect(flashcardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(flashcardRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
  });
});
