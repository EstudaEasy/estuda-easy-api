import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceShareLinkModel } from '@database/typeorm/models/resource-share-link/resource-share-link.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareLinkMock } from '@domain/resource-share-link/__mocks__/resource-share-link.mock';

import { ResourceShareLinkRepository } from '../resource-share-link.repository';

describe('TypeOrm -> ResourceShareLink Repository -> Find One', () => {
  const shareLinkMock = new ResourceShareLinkMock();

  let shareLinkRepository: ResourceShareLinkRepository;
  let shareLinkRepositoryMock: Repository<ResourceShareLinkModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareLinkRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareLinkModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    shareLinkRepository = module.get<ResourceShareLinkRepository>(ResourceShareLinkRepository);
    shareLinkRepositoryMock = module.get<Repository<ResourceShareLinkModel>>(
      getRepositoryToken(ResourceShareLinkModel)
    );

    findOneSpy = jest.spyOn(shareLinkRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(shareLinkMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a resource share link - link found', async () => {
    const res = await shareLinkRepository.findOne({ id: shareLinkMock.id });

    expect(res).toStrictEqual(shareLinkMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - link not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await shareLinkRepository.findOne({ id: shareLinkMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
