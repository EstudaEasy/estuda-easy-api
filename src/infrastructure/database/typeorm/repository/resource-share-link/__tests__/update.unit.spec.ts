import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { ResourceShareLinkModel } from '@database/typeorm/models/resource-share-link/resource-share-link.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { ResourceShareLinkMock } from '@domain/entities/resource-share-link/__mocks__/resource-share-link.mock';

import { ResourceShareLinkRepository } from '../resource-share-link.repository';

describe('TypeOrm -> ResourceShareLink Repository -> Update', () => {
  const shareLinkMock = new ResourceShareLinkMock();

  let shareLinkRepository: ResourceShareLinkRepository;
  let shareLinkRepositoryMock: Repository<ResourceShareLinkModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareLinkRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareLinkModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    shareLinkRepository = module.get<ResourceShareLinkRepository>(ResourceShareLinkRepository);
    shareLinkRepositoryMock = module.get<Repository<ResourceShareLinkModel>>(
      getRepositoryToken(ResourceShareLinkModel)
    );

    updateSpy = jest.spyOn(shareLinkRepositoryMock, 'update');
    findOneSpy = jest.spyOn(shareLinkRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a resource share link - link updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(shareLinkMock);

    const res = await shareLinkRepository.update({ id: shareLinkMock.id }, { permission: SharePermission.EDIT });

    expect(res).toStrictEqual(shareLinkMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - link not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await shareLinkRepository.update({ id: shareLinkMock.id }, { permission: SharePermission.EDIT });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
