import { Test } from '@nestjs/testing';

import { Exception, ResourceShareErrorCodes } from '@application/errors';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';
import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { RESOURCE_SHARE_REPOSITORY_TOKEN } from '@domain/repositories/resource-share/resource-share.repository';

import { DeleteResourceShareUseCase } from '../delete-resource-share.use-case';

describe('Use Cases -> Resource Share -> Delete', () => {
  let deleteResourceShareUseCase: DeleteResourceShareUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ userId: user.id });
  const share = new ResourceShareMock({ resourceId: resource.id });
  const shareWithResource = { ...share, resource };

  const resourceShareRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteResourceShareUseCase,
        {
          provide: RESOURCE_SHARE_REPOSITORY_TOKEN,
          useValue: resourceShareRepositoryMock
        }
      ]
    }).compile();

    deleteResourceShareUseCase = module.get<DeleteResourceShareUseCase>(DeleteResourceShareUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete resource share', async () => {
    resourceShareRepositoryMock.findOne.mockResolvedValue(shareWithResource);
    resourceShareRepositoryMock.delete.mockResolvedValue(true);

    const input = { shareId: share.id, userId: user.id };

    await expect(deleteResourceShareUseCase.execute(input)).resolves.toBeUndefined();

    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.shareId }, { resource: true });
    expect(resourceShareRepositoryMock.delete).toHaveBeenCalledWith({ id: input.shareId });
  });

  it('should throw NOT_FOUND when resource share does not exist', async () => {
    resourceShareRepositoryMock.findOne.mockResolvedValue(null);

    const input = { shareId: share.id, userId: user.id };

    await expect(deleteResourceShareUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareErrorCodes.NOT_FOUND)
    );
    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.shareId }, { resource: true });
    expect(resourceShareRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should throw NOT_OWNER when user is not the resource owner', async () => {
    const otherUser = new UserMock();
    resourceShareRepositoryMock.findOne.mockResolvedValue(shareWithResource);

    const input = { shareId: share.id, userId: otherUser.id };

    await expect(deleteResourceShareUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareErrorCodes.NOT_OWNER)
    );
    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.shareId }, { resource: true });
    expect(resourceShareRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should throw NOT_DELETED when delete fails', async () => {
    resourceShareRepositoryMock.findOne.mockResolvedValue(shareWithResource);
    resourceShareRepositoryMock.delete.mockResolvedValue(false);

    const input = { shareId: share.id, userId: user.id };

    await expect(deleteResourceShareUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareErrorCodes.NOT_DELETED)
    );
    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.shareId }, { resource: true });
    expect(resourceShareRepositoryMock.delete).toHaveBeenCalledWith({ id: input.shareId });
  });
});
