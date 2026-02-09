import { Test } from '@nestjs/testing';

import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';
import { FLASHCARD_REPOSITORY_TOKEN } from '@domain/repositories/flashcard/flashcard.repository';

import { FindFlashcardsUseCase } from '../find-flashcards.use-case';

describe('Use Cases -> Flashcard -> Find', () => {
  let findFlashcardsUseCase: FindFlashcardsUseCase;

  const flashcards = FlashcardMock.getList(2);
  const total = flashcards.length;

  const flashcardRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindFlashcardsUseCase,
        {
          provide: FLASHCARD_REPOSITORY_TOKEN,
          useValue: flashcardRepositoryMock
        }
      ]
    }).compile();

    findFlashcardsUseCase = module.get<FindFlashcardsUseCase>(FindFlashcardsUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find flashcards', async () => {
    flashcardRepositoryMock.find.mockResolvedValue({ flashcards, total });

    const input = {
      filters: {}
    };

    const result = await findFlashcardsUseCase.execute(input);

    expect(flashcardRepositoryMock.find).toHaveBeenCalledWith(input.filters);
    expect(result.flashcards).toEqual(flashcards);
    expect(result.total).toBe(total);
  });

  it('should find flashcards with filters', async () => {
    const filteredFlashcards = [flashcards[0]];
    flashcardRepositoryMock.find.mockResolvedValue({ flashcards: filteredFlashcards, total: 1 });

    const input = {
      filters: { deckId: flashcards[0].deckId }
    };

    const result = await findFlashcardsUseCase.execute(input);

    expect(flashcardRepositoryMock.find).toHaveBeenCalledWith(input.filters);
    expect(result.flashcards).toEqual(filteredFlashcards);
    expect(result.total).toBe(1);
  });
});
