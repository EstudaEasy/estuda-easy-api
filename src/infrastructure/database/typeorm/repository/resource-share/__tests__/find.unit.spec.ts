import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceShareModel } from '@database/typeorm/models/resource-share/resource-share.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';

import { ResourceShareRepository } from '../resource-share.repository';

describe('TypeOrm -> ResourceShare Repository -> Find', () => {
  const shareMocks = ResourceShareMock.getList(3);

  let shareRepository: ResourceShareRepository;
  let shareRepositoryMock: Repository<ResourceShareModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    shareRepository = module.get<ResourceShareRepository>(ResourceShareRepository);
    shareRepositoryMock = module.get<Repository<ResourceShareModel>>(getRepositoryToken(ResourceShareModel));

    findAndCountSpy = jest.spyOn(shareRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return resource shares with count', async () => {
    findAndCountSpy.mockResolvedValue([shareMocks, shareMocks.length]);

    const res = await shareRepository.find();

    expect(res).toEqual({ shares: shareMocks, total: 3 });
    expect(res.shares).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no resource shares found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await shareRepository.find();

    expect(res).toEqual({ shares: [], total: 0 });
    expect(res.shares).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
