import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { DeckModel } from '@database/typeorm/models/deck/deck.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { DeckMock } from '@domain/entities/deck/__mocks__/deck.mock';

import { DeckRepository } from '../deck.repository';

describe('TypeOrm -> Deck Repository -> Delete', () => {
  const deckMock = new DeckMock();

  let deckRepository: DeckRepository;
  let deckRepositoryMock: Repository<DeckModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeckRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(DeckModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    deckRepository = module.get<DeckRepository>(DeckRepository);
    deckRepositoryMock = module.get<Repository<DeckModel>>(getRepositoryToken(DeckModel));

    deleteSpy = jest.spyOn(deckRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a deck and return true - deck found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await deckRepository.delete({ id: deckMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - deck not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await deckRepository.delete({ id: deckMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
