import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { ResourceShareModel } from '@database/typeorm/models/resource-share/resource-share.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';

import { ResourceShareRepository } from '../resource-share.repository';

describe('TypeOrm -> ResourceShare Repository -> Create', () => {
  const shareMock = new ResourceShareMock();

  let shareRepository: ResourceShareRepository;
  let shareRepositoryMock: Repository<ResourceShareModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    shareRepository = module.get<ResourceShareRepository>(ResourceShareRepository);
    shareRepositoryMock = module.get<Repository<ResourceShareModel>>(getRepositoryToken(ResourceShareModel));

    createSpy = jest.spyOn(shareRepositoryMock, 'create');
    createSpy.mockReturnValue(shareMock);

    saveSpy = jest.spyOn(shareRepositoryMock, 'save');
    saveSpy.mockResolvedValue(shareMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a resource share', async () => {
    const res = await shareRepository.create({
      permission: shareMock.permission,
      resourceId: shareMock.resourceId,
      userId: shareMock.userId
    });

    expect(res).toStrictEqual(shareMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
