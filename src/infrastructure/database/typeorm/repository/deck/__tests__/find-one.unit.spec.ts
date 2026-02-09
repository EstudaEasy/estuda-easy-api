import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { DeckModel } from '@database/typeorm/models/deck/deck.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';

import { DeckRepository } from '../deck.repository';

describe('TypeOrm -> Deck Repository -> Find One', () => {
  const deckMock = new DeckMock();

  let deckRepository: DeckRepository;
  let deckRepositoryMock: Repository<DeckModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeckRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DeckModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    deckRepository = module.get<DeckRepository>(DeckRepository);
    deckRepositoryMock = module.get<Repository<DeckModel>>(getRepositoryToken(DeckModel));

    findOneSpy = jest.spyOn(deckRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(deckMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a deck - deck found', async () => {
    const res = await deckRepository.findOne({ id: deckMock.id });

    expect(res).toStrictEqual(deckMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - deck not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await deckRepository.findOne({ id: deckMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
