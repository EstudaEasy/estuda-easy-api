import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeckModel } from '@database/typeorm/models/deck/deck.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';

import { DeckRepository } from '../deck.repository';

describe('TypeOrm -> Deck Repository -> Create', () => {
  const deckMock = new DeckMock();

  let deckRepository: DeckRepository;
  let deckRepositoryMock: Repository<DeckModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeckRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DeckModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    deckRepository = module.get<DeckRepository>(DeckRepository);
    deckRepositoryMock = module.get<Repository<DeckModel>>(getRepositoryToken(DeckModel));

    createSpy = jest.spyOn(deckRepositoryMock, 'create');
    createSpy.mockReturnValue(deckMock);

    saveSpy = jest.spyOn(deckRepositoryMock, 'save');
    saveSpy.mockResolvedValue(deckMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a deck', async () => {
    const res = await deckRepository.create({
      name: deckMock.name,
      description: deckMock.description
    });

    expect(res).toStrictEqual(deckMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
