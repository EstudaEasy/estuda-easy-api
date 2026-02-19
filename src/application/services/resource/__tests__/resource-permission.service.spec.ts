import { Test } from '@nestjs/testing';

import { Exception, ResourceErrorCodes } from '@application/errors';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { RESOURCE_REPOSITORY_TOKEN } from '@domain/repositories/resource/resource.repository';
import { FilterOperator } from '@shared/types';

import { ResourcePermissionService } from '../resource-permission.service';

describe('Services -> Resource -> Permission', () => {
  let resourcePermissionService: ResourcePermissionService;

  const resource = new ResourceMock();
  const user = new UserMock();

  const resourceRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        ResourcePermissionService,
        {
          provide: RESOURCE_REPOSITORY_TOKEN,
          useValue: resourceRepositoryMock
        }
      ]
    }).compile();

    resourcePermissionService = module.get<ResourcePermissionService>(ResourcePermissionService);
  });

  afterEach(() => jest.clearAllMocks());

  describe('verifyOrThrow', () => {
    it('should pass when user is the owner', async () => {
      const ownerResource = new ResourceMock({ userId: user.id });
      resourceRepositoryMock.findOne.mockResolvedValue(ownerResource);

      await expect(
        resourcePermissionService.verifyOrThrow(ownerResource.id, user.id, ownerResource.type, [SharePermission.READ])
      ).resolves.toBeUndefined();

      expect(resourceRepositoryMock.findOne).toHaveBeenCalledTimes(1);
      expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith({ [ownerResource.type]: { id: ownerResource.id } });
    });

    it('should pass when user has shared permission', async () => {
      const permissions = [SharePermission.EDIT, SharePermission.ADMIN];
      resourceRepositoryMock.findOne.mockResolvedValueOnce(resource).mockResolvedValueOnce(resource);

      await expect(
        resourcePermissionService.verifyOrThrow(resource.id, user.id, resource.type, permissions)
      ).resolves.toBeUndefined();

      expect(resourceRepositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(resourceRepositoryMock.findOne).toHaveBeenNthCalledWith(1, { [resource.type]: { id: resource.id } });
      expect(resourceRepositoryMock.findOne).toHaveBeenNthCalledWith(2, {
        id: resource.id,
        shares: { userId: user.id, permission: { operator: FilterOperator.IN, value: permissions } }
      });
    });

    it('should throw when user has no permission', async () => {
      resourceRepositoryMock.findOne.mockResolvedValueOnce(resource).mockResolvedValueOnce(null);

      await expect(
        resourcePermissionService.verifyOrThrow(resource.id, user.id, resource.type, [SharePermission.READ])
      ).rejects.toThrow(new Exception(ResourceErrorCodes.INSUFFICIENT_PERMISSIONS));

      expect(resourceRepositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(resourceRepositoryMock.findOne).toHaveBeenNthCalledWith(1, { [resource.type]: { id: resource.id } });
      expect(resourceRepositoryMock.findOne).toHaveBeenNthCalledWith(2, {
        id: resource.id,
        shares: { userId: user.id, permission: { operator: FilterOperator.IN, value: [SharePermission.READ] } }
      });
    });

    it('should pass with empty permissions array', async () => {
      resourceRepositoryMock.findOne.mockResolvedValue(resource).mockResolvedValueOnce(resource);

      await expect(
        resourcePermissionService.verifyOrThrow(resource.id, user.id, resource.type, [])
      ).resolves.toBeUndefined();

      expect(resourceRepositoryMock.findOne).toHaveBeenCalledTimes(2);
      expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith({ [resource.type]: { id: resource.id } });
      expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith({
        id: resource.id,
        shares: { userId: user.id, permission: undefined }
      });
    });
  });
});
