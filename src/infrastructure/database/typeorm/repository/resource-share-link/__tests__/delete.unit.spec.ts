import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { ResourceShareLinkModel } from '@database/typeorm/models/resource-share-link/resource-share-link.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareLinkMock } from '@domain/resource-share-link/__mocks__/resource-share-link.mock';

import { ResourceShareLinkRepository } from '../resource-share-link.repository';

describe('TypeOrm -> ResourceShareLink Repository -> Delete', () => {
  const shareLinkMock = new ResourceShareLinkMock();

  let shareLinkRepository: ResourceShareLinkRepository;
  let shareLinkRepositoryMock: Repository<ResourceShareLinkModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareLinkRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareLinkModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    shareLinkRepository = module.get<ResourceShareLinkRepository>(ResourceShareLinkRepository);
    shareLinkRepositoryMock = module.get<Repository<ResourceShareLinkModel>>(
      getRepositoryToken(ResourceShareLinkModel)
    );

    deleteSpy = jest.spyOn(shareLinkRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a resource share link and return true - link found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await shareLinkRepository.delete({ id: shareLinkMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - link not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await shareLinkRepository.delete({ id: shareLinkMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
