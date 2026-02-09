import { Test } from '@nestjs/testing';

import { DeckErrorCodes, Exception } from '@application/errors';
import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';
import { DECK_REPOSITORY_TOKEN } from '@domain/repositories/deck/deck.repository';

import { DeleteDeckUseCase } from '../delete-deck.use-case';

describe('Use Cases -> Deck -> Delete', () => {
  let deleteDeckUseCase: DeleteDeckUseCase;

  const deck = new DeckMock();

  const deckRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteDeckUseCase,
        {
          provide: DECK_REPOSITORY_TOKEN,
          useValue: deckRepositoryMock
        }
      ]
    }).compile();

    deleteDeckUseCase = module.get<DeleteDeckUseCase>(DeleteDeckUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete deck', async () => {
    deckRepositoryMock.findOne.mockResolvedValue(deck);
    deckRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: deck.id }
    };

    await expect(deleteDeckUseCase.execute(input)).resolves.toBeUndefined();

    expect(deckRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(deckRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should not delete - deck not found', async () => {
    deckRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: deck.id }
    };

    await expect(deleteDeckUseCase.execute(input)).rejects.toThrow(new Exception(DeckErrorCodes.NOT_FOUND));
    expect(deckRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(deckRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - failed to delete', async () => {
    deckRepositoryMock.findOne.mockResolvedValue(deck);
    deckRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: deck.id }
    };

    await expect(deleteDeckUseCase.execute(input)).rejects.toThrow(new Exception(DeckErrorCodes.NOT_DELETED));
    expect(deckRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(deckRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });
});
