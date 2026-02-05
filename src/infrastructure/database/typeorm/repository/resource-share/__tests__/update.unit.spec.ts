import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { ResourceShareModel } from '@database/typeorm/models/resource-share/resource-share.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';

import { ResourceShareRepository } from '../resource-share.repository';

describe('TypeOrm -> ResourceShare Repository -> Update', () => {
  const shareMock = new ResourceShareMock();

  let shareRepository: ResourceShareRepository;
  let shareRepositoryMock: Repository<ResourceShareModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourceShareRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(ResourceShareModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    shareRepository = module.get<ResourceShareRepository>(ResourceShareRepository);
    shareRepositoryMock = module.get<Repository<ResourceShareModel>>(getRepositoryToken(ResourceShareModel));

    updateSpy = jest.spyOn(shareRepositoryMock, 'update');
    findOneSpy = jest.spyOn(shareRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a resource share - share updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(shareMock);

    const res = await shareRepository.update({ id: shareMock.id }, { permission: SharePermission.EDIT });

    expect(res).toStrictEqual(shareMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - share not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await shareRepository.update({ id: shareMock.id }, { permission: SharePermission.EDIT });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
