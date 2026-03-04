import { Test } from '@nestjs/testing';

import { Exception, ResourceShareErrorCodes } from '@application/errors';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';
import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { RESOURCE_SHARE_REPOSITORY_TOKEN } from '@domain/repositories/resource-share/resource-share.repository';

import { UpdateResourceShareUseCase } from '../update-resource-share.use-case';

describe('Use Cases -> Resource Share -> Update', () => {
  let updateResourceShareUseCase: UpdateResourceShareUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ userId: user.id });
  const share = new ResourceShareMock({ resourceId: resource.id });
  const shareWithResource = { ...share, resource };

  const resourceShareRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateResourceShareUseCase,
        {
          provide: RESOURCE_SHARE_REPOSITORY_TOKEN,
          useValue: resourceShareRepositoryMock
        }
      ]
    }).compile();

    updateResourceShareUseCase = module.get<UpdateResourceShareUseCase>(UpdateResourceShareUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update resource share', async () => {
    const updatedShare = new ResourceShareMock({ ...share, permission: SharePermission.EDIT });
    resourceShareRepositoryMock.findOne.mockResolvedValue(shareWithResource);
    resourceShareRepositoryMock.update.mockResolvedValue(updatedShare);

    const input = { shareId: share.id, userId: user.id, permission: SharePermission.EDIT };

    const result = await updateResourceShareUseCase.execute(input);

    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.shareId }, { resource: true });
    expect(resourceShareRepositoryMock.update).toHaveBeenCalledWith(
      { id: input.shareId },
      { permission: input.permission }
    );
    expect(result).toEqual(updatedShare);
  });

  it('should throw NOT_FOUND when resource share does not exist', async () => {
    resourceShareRepositoryMock.findOne.mockResolvedValue(null);

    const input = { shareId: share.id, userId: user.id, permission: SharePermission.EDIT };

    await expect(updateResourceShareUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareErrorCodes.NOT_FOUND)
    );
    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.shareId }, { resource: true });
    expect(resourceShareRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw NOT_OWNER when user is not the resource owner', async () => {
    const otherUser = new UserMock();
    resourceShareRepositoryMock.findOne.mockResolvedValue(shareWithResource);

    const input = { shareId: share.id, userId: otherUser.id, permission: SharePermission.EDIT };

    await expect(updateResourceShareUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareErrorCodes.NOT_OWNER)
    );
    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.shareId }, { resource: true });
    expect(resourceShareRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should throw NOT_UPDATED when update fails', async () => {
    resourceShareRepositoryMock.findOne.mockResolvedValue(shareWithResource);
    resourceShareRepositoryMock.update.mockResolvedValue(null);

    const input = { shareId: share.id, userId: user.id, permission: SharePermission.EDIT };

    await expect(updateResourceShareUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareErrorCodes.NOT_UPDATED)
    );
    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.shareId }, { resource: true });
    expect(resourceShareRepositoryMock.update).toHaveBeenCalledWith(
      { id: input.shareId },
      { permission: input.permission }
    );
  });
});
