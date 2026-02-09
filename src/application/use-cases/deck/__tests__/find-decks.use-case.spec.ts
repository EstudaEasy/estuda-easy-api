import { Test } from '@nestjs/testing';

import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';
import { DECK_REPOSITORY_TOKEN } from '@domain/repositories/deck/deck.repository';

import { FindDecksUseCase } from '../find-decks.use-case';

describe('Use Cases -> Deck -> Find', () => {
  let findDecksUseCase: FindDecksUseCase;

  const decks = DeckMock.getList(2);
  const total = decks.length;

  const deckRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindDecksUseCase,
        {
          provide: DECK_REPOSITORY_TOKEN,
          useValue: deckRepositoryMock
        }
      ]
    }).compile();

    findDecksUseCase = module.get<FindDecksUseCase>(FindDecksUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find decks', async () => {
    deckRepositoryMock.find.mockResolvedValue({ decks, total });

    const input = {
      filters: {},
      relations: { flashcards: true }
    };

    const result = await findDecksUseCase.execute(input);

    expect(deckRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.decks).toEqual(decks);
    expect(result.total).toBe(total);
  });

  it('should find decks with filters', async () => {
    const filteredDecks = [decks[0]];
    deckRepositoryMock.find.mockResolvedValue({ decks: filteredDecks, total: 1 });

    const input = {
      filters: { name: decks[0].name },
      relations: { flashcards: true }
    };

    const result = await findDecksUseCase.execute(input);

    expect(deckRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.decks).toEqual(filteredDecks);
    expect(result.total).toBe(1);
  });
});
