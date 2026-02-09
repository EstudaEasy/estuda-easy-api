import { Test } from '@nestjs/testing';

import { DeckErrorCodes, Exception } from '@application/errors';
import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';
import { DECK_REPOSITORY_TOKEN } from '@domain/repositories/deck/deck.repository';

import { FindOneDeckUseCase } from '../find-one-deck.use-case';

describe('Use Cases -> Deck -> Find One', () => {
  let findOneDeckUseCase: FindOneDeckUseCase;

  const deck = new DeckMock();

  const deckRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneDeckUseCase,
        {
          provide: DECK_REPOSITORY_TOKEN,
          useValue: deckRepositoryMock
        }
      ]
    }).compile();

    findOneDeckUseCase = module.get<FindOneDeckUseCase>(FindOneDeckUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one deck', async () => {
    deckRepositoryMock.findOne.mockResolvedValue(deck);

    const input = {
      filters: { id: deck.id },
      relations: { flashcards: true }
    };

    const result = await findOneDeckUseCase.execute(input);

    expect(deckRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(deck);
  });

  it('should not find deck - deck not found', async () => {
    deckRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: deck.id }
    };

    await expect(findOneDeckUseCase.execute(input)).rejects.toThrow(new Exception(DeckErrorCodes.NOT_FOUND));
    expect(deckRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
