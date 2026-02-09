import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { DeckModel } from '@database/typeorm/models/deck/deck.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';

import { DeckRepository } from '../deck.repository';

describe('TypeOrm -> Deck Repository -> Update', () => {
  const deckMock = new DeckMock();

  let deckRepository: DeckRepository;
  let deckRepositoryMock: Repository<DeckModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeckRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DeckModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    deckRepository = module.get<DeckRepository>(DeckRepository);
    deckRepositoryMock = module.get<Repository<DeckModel>>(getRepositoryToken(DeckModel));

    updateSpy = jest.spyOn(deckRepositoryMock, 'update');
    findOneSpy = jest.spyOn(deckRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a deck - deck updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(deckMock);

    const res = await deckRepository.update({ id: deckMock.id }, { name: 'Updated Name' });

    expect(res).toStrictEqual(deckMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - deck not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await deckRepository.update({ id: deckMock.id }, { name: 'Updated Name' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
