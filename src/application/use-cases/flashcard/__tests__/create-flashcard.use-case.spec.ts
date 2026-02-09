import { Test } from '@nestjs/testing';

import { FlashcardMock } from '@domain/entities/flashcard/__mocks__/flashcard.mock';
import { FLASHCARD_REPOSITORY_TOKEN } from '@domain/repositories/flashcard/flashcard.repository';

import { CreateFlashcardUseCase } from '../create-flashcard.use-case';

describe('Use Cases -> Flashcard -> Create', () => {
  let createFlashcardUseCase: CreateFlashcardUseCase;

  const flashcard = new FlashcardMock();

  const flashcardRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateFlashcardUseCase,
        {
          provide: FLASHCARD_REPOSITORY_TOKEN,
          useValue: flashcardRepositoryMock
        }
      ]
    }).compile();

    createFlashcardUseCase = module.get<CreateFlashcardUseCase>(CreateFlashcardUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create flashcard', async () => {
    flashcardRepositoryMock.create.mockResolvedValue(flashcard);

    const input = {
      data: {
        deckId: flashcard.deckId,
        front: flashcard.front,
        back: flashcard.back,
        position: flashcard.position
      }
    };

    const result = await createFlashcardUseCase.execute(input);

    expect(flashcardRepositoryMock.create).toHaveBeenCalledWith(input.data);
    expect(result).toEqual(flashcard);
  });
});
