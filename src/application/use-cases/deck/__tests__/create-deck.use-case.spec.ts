import { Test } from '@nestjs/testing';

import { DeckMock } from '@domain/deck/__mocks__/deck.mock';
import { DECK_REPOSITORY_TOKEN } from '@domain/deck/deck.repository';
import { ResourceMock } from '@domain/resource/__mocks__/resource.mock';
import { ResourceType } from '@domain/resource/resource.interface';
import { RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { UserMock } from '@domain/user/__mocks__/user.mock';

import { CreateDeckUseCase } from '../create-deck.use-case';

describe('Use Cases -> Deck -> Create', () => {
  let createDeckUseCase: CreateDeckUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ type: ResourceType.DECK, userId: user.id });
  const deck = new DeckMock({ resourceId: resource.id });

  const resourceRepositoryMock = {
    create: jest.fn()
  };

  const deckRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateDeckUseCase,
        {
          provide: RESOURCE_REPOSITORY_TOKEN,
          useValue: resourceRepositoryMock
        },
        {
          provide: DECK_REPOSITORY_TOKEN,
          useValue: deckRepositoryMock
        }
      ]
    }).compile();

    createDeckUseCase = module.get<CreateDeckUseCase>(CreateDeckUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create deck with resource', async () => {
    resourceRepositoryMock.create.mockResolvedValue(resource);
    deckRepositoryMock.create.mockResolvedValue(deck);

    const input = {
      data: {
        name: deck.name,
        description: deck.description
      },
      userId: user.id
    };

    const result = await createDeckUseCase.execute(input);

    expect(resourceRepositoryMock.create).toHaveBeenCalledWith({
      type: ResourceType.DECK,
      userId: user.id
    });
    expect(deckRepositoryMock.create).toHaveBeenCalledWith({
      ...input.data,
      resource
    });
    expect(result).toEqual(deck);
  });
});
