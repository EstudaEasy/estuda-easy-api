import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceShareLinkModel } from '@database/typeorm/models/resource-share-link/resource-share-link.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareLinkMock } from '@domain/resource-share-link/__mocks__/resource-share-link.mock';

import { ResourceShareLinkRepository } from '../resource-share-link.repository';

describe('TypeOrm -> ResourceShareLink Repository -> Find', () => {
  const shareLinkMocks = ResourceShareLinkMock.getList(3);

  let shareLinkRepository: ResourceShareLinkRepository;
  let shareLinkRepositoryMock: Repository<ResourceShareLinkModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareLinkRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareLinkModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    shareLinkRepository = module.get<ResourceShareLinkRepository>(ResourceShareLinkRepository);
    shareLinkRepositoryMock = module.get<Repository<ResourceShareLinkModel>>(
      getRepositoryToken(ResourceShareLinkModel)
    );

    findAndCountSpy = jest.spyOn(shareLinkRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return resource share links with count', async () => {
    findAndCountSpy.mockResolvedValue([shareLinkMocks, shareLinkMocks.length]);

    const res = await shareLinkRepository.find();

    expect(res).toEqual({ shareLinks: shareLinkMocks, total: 3 });
    expect(res.shareLinks).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no resource share links found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await shareLinkRepository.find();

    expect(res).toEqual({ shareLinks: [], total: 0 });
    expect(res.shareLinks).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
