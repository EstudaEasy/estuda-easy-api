import { Test } from '@nestjs/testing';

import { FlashcardErrorCodes, Exception } from '@application/errors';
import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';
import { FLASHCARD_REPOSITORY_TOKEN } from '@domain/repositories/flashcard/flashcard.repository';

import { DeleteFlashcardUseCase } from '../delete-flashcard.use-case';

describe('Use Cases -> Flashcard -> Delete', () => {
  let deleteFlashcardUseCase: DeleteFlashcardUseCase;

  const flashcard = new FlashcardMock();

  const flashcardRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteFlashcardUseCase,
        {
          provide: FLASHCARD_REPOSITORY_TOKEN,
          useValue: flashcardRepositoryMock
        }
      ]
    }).compile();

    deleteFlashcardUseCase = module.get<DeleteFlashcardUseCase>(DeleteFlashcardUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete flashcard', async () => {
    flashcardRepositoryMock.findOne.mockResolvedValue(flashcard);
    flashcardRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: flashcard.id }
    };

    await expect(deleteFlashcardUseCase.execute(input)).resolves.toBeUndefined();

    expect(flashcardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(flashcardRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should not delete - flashcard not found', async () => {
    flashcardRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: flashcard.id }
    };

    await expect(deleteFlashcardUseCase.execute(input)).rejects.toThrow(new Exception(FlashcardErrorCodes.NOT_FOUND));
    expect(flashcardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(flashcardRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - failed to delete', async () => {
    flashcardRepositoryMock.findOne.mockResolvedValue(flashcard);
    flashcardRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: flashcard.id }
    };

    await expect(deleteFlashcardUseCase.execute(input)).rejects.toThrow(new Exception(FlashcardErrorCodes.NOT_DELETED));
    expect(flashcardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(flashcardRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });
});
