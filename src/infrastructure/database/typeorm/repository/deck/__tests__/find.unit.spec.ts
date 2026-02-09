import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeckModel } from '@database/typeorm/models/deck/deck.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';

import { DeckRepository } from '../deck.repository';

describe('TypeOrm -> Deck Repository -> Find', () => {
  const deckMocks = DeckMock.getList(3);

  let deckRepository: DeckRepository;
  let deckRepositoryMock: Repository<DeckModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeckRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DeckModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    deckRepository = module.get<DeckRepository>(DeckRepository);
    deckRepositoryMock = module.get<Repository<DeckModel>>(getRepositoryToken(DeckModel));

    findAndCountSpy = jest.spyOn(deckRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return decks with count', async () => {
    findAndCountSpy.mockResolvedValue([deckMocks, deckMocks.length]);

    const res = await deckRepository.find();

    expect(res).toEqual({ decks: deckMocks, total: 3 });
    expect(res.decks).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no decks found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await deckRepository.find();

    expect(res).toEqual({ decks: [], total: 0 });
    expect(res.decks).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
