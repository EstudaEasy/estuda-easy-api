import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceShareLinkModel } from '@database/typeorm/models/resource-share-link/resource-share-link.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareLinkMock } from '@domain/entities/resource-share-link/__mocks__/resource-share-link.mock';

import { ResourceShareLinkRepository } from '../resource-share-link.repository';

describe('TypeOrm -> ResourceShareLink Repository -> Create', () => {
  const shareLinkMock = new ResourceShareLinkMock();

  let shareLinkRepository: ResourceShareLinkRepository;
  let shareLinkRepositoryMock: Repository<ResourceShareLinkModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareLinkRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareLinkModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    shareLinkRepository = module.get<ResourceShareLinkRepository>(ResourceShareLinkRepository);
    shareLinkRepositoryMock = module.get<Repository<ResourceShareLinkModel>>(
      getRepositoryToken(ResourceShareLinkModel)
    );

    createSpy = jest.spyOn(shareLinkRepositoryMock, 'create');
    createSpy.mockReturnValue(shareLinkMock);

    saveSpy = jest.spyOn(shareLinkRepositoryMock, 'save');
    saveSpy.mockResolvedValue(shareLinkMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a resource share link', async () => {
    const res = await shareLinkRepository.create({
      resourceId: shareLinkMock.resourceId,
      permission: shareLinkMock.permission
    });

    expect(res).toStrictEqual(shareLinkMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
