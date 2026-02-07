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
      resourceRepositoryMock.findOne.mockResolvedValue(resource);

      await expect(
        resourcePermissionService.verifyOrThrow(resource.id, user.id, [SharePermission.READ])
      ).resolves.toBeUndefined();

      expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith([
        { id: resource.id, userId: user.id },
        {
          id: resource.id,
          shares: { userId: user.id, permission: { operator: FilterOperator.IN, value: [SharePermission.READ] } }
        }
      ]);
    });

    it('should pass when user has shared permission', async () => {
      resourceRepositoryMock.findOne.mockResolvedValue(resource);

      const permissions = [SharePermission.EDIT, SharePermission.ADMIN];

      await expect(resourcePermissionService.verifyOrThrow(resource.id, user.id, permissions)).resolves.toBeUndefined();

      expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith([
        { id: resource.id, userId: user.id },
        {
          id: resource.id,
          shares: { userId: user.id, permission: { operator: FilterOperator.IN, value: permissions } }
        }
      ]);
    });

    it('should throw when user has no permission', async () => {
      resourceRepositoryMock.findOne.mockResolvedValue(null);

      await expect(
        resourcePermissionService.verifyOrThrow(resource.id, user.id, [SharePermission.READ])
      ).rejects.toThrow(new Exception(ResourceErrorCodes.INSUFFICIENT_PERMISSIONS));
    });

    it('should pass with empty permissions array (owner only)', async () => {
      resourceRepositoryMock.findOne.mockResolvedValue(resource);

      await expect(resourcePermissionService.verifyOrThrow(resource.id, user.id, [])).resolves.toBeUndefined();

      expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith([
        { id: resource.id, userId: user.id },
        { id: resource.id, shares: { userId: user.id, permission: { operator: FilterOperator.IN, value: [] } } }
      ]);
    });
  });
});
