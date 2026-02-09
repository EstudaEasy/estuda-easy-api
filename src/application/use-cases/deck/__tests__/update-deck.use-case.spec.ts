import { Test } from '@nestjs/testing';

import { DeckErrorCodes, Exception } from '@application/errors';
import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';
import { DECK_REPOSITORY_TOKEN } from '@domain/repositories/deck/deck.repository';

import { UpdateDeckUseCase } from '../update-deck.use-case';

describe('Use Cases -> Deck -> Update', () => {
  let updateDeckUseCase: UpdateDeckUseCase;

  const deck = new DeckMock();

  const deckRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateDeckUseCase,
        {
          provide: DECK_REPOSITORY_TOKEN,
          useValue: deckRepositoryMock
        }
      ]
    }).compile();

    updateDeckUseCase = module.get<UpdateDeckUseCase>(UpdateDeckUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update deck', async () => {
    deckRepositoryMock.findOne.mockResolvedValue(deck);
    deckRepositoryMock.update.mockResolvedValue(deck);

    const input = {
      filters: { id: deck.id },
      data: {
        name: 'Updated Name',
        description: 'Updated Description'
      }
    };

    const result = await updateDeckUseCase.execute(input);

    expect(deckRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(deckRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(deck);
  });

  it('should not update - deck not found', async () => {
    deckRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: deck.id },
      data: { name: 'Updated Name' }
    };

    await expect(updateDeckUseCase.execute(input)).rejects.toThrow(new Exception(DeckErrorCodes.NOT_FOUND));
    expect(deckRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(deckRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - update failed', async () => {
    deckRepositoryMock.findOne.mockResolvedValue(deck);
    deckRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: deck.id },
      data: { name: 'Updated Name' }
    };

    await expect(updateDeckUseCase.execute(input)).rejects.toThrow(new Exception(DeckErrorCodes.NOT_UPDATED));
    expect(deckRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(deckRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
  });
});
