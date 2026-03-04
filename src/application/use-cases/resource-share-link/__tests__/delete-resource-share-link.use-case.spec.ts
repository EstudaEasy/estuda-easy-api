import { Test } from '@nestjs/testing';

import { Exception, ResourceShareLinkErrorCodes } from '@application/errors';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';
import { ResourceShareLinkMock } from '@domain/entities/resource-share-link/__mocks__/resource-share-link.mock';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { RESOURCE_SHARE_LINK_REPOSITORY_TOKEN } from '@domain/repositories/resource-share-link/resource-share-link.repository';

import { DeleteResourceShareLinkUseCase } from '../delete-resource-share-link.use-case';

describe('Use Cases -> Resource Share Link -> Delete', () => {
  let deleteResourceShareLinkUseCase: DeleteResourceShareLinkUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ userId: user.id });
  const shareLink = new ResourceShareLinkMock({ resourceId: resource.id });
  const shareLinkWithResource = { ...shareLink, resource };

  const resourceShareLinkRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteResourceShareLinkUseCase,
        {
          provide: RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
          useValue: resourceShareLinkRepositoryMock
        }
      ]
    }).compile();

    deleteResourceShareLinkUseCase = module.get<DeleteResourceShareLinkUseCase>(DeleteResourceShareLinkUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete resource share link', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLinkWithResource);
    resourceShareLinkRepositoryMock.delete.mockResolvedValue(true);

    const input = { resourceId: shareLink.resourceId, userId: user.id };

    await expect(deleteResourceShareLinkUseCase.execute(input)).resolves.toBeUndefined();

    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith(
      { resourceId: input.resourceId },
      { resource: true }
    );
    expect(resourceShareLinkRepositoryMock.delete).toHaveBeenCalledWith({ id: shareLinkWithResource.id });
  });

  it('should throw NOT_FOUND when share link does not exist', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(null);

    const input = { resourceId: shareLink.resourceId, userId: user.id };

    await expect(deleteResourceShareLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.NOT_FOUND)
    );
    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith(
      { resourceId: input.resourceId },
      { resource: true }
    );
    expect(resourceShareLinkRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should throw INVALID_PERMISSION_TO_DELETE when user is not the resource owner', async () => {
    const otherUser = new UserMock();
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLinkWithResource);

    const input = { resourceId: shareLink.resourceId, userId: otherUser.id };

    await expect(deleteResourceShareLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.INVALID_PERMISSION_TO_DELETE)
    );
    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith(
      { resourceId: input.resourceId },
      { resource: true }
    );
    expect(resourceShareLinkRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should throw NOT_DELETED when delete fails', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLinkWithResource);
    resourceShareLinkRepositoryMock.delete.mockResolvedValue(false);

    const input = { resourceId: shareLink.resourceId, userId: user.id };

    await expect(deleteResourceShareLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.NOT_DELETED)
    );
    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith(
      { resourceId: input.resourceId },
      { resource: true }
    );
    expect(resourceShareLinkRepositoryMock.delete).toHaveBeenCalledWith({ id: shareLinkWithResource.id });
  });
});
