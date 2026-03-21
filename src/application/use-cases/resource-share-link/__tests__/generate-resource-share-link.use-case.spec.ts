import { Test } from '@nestjs/testing';

import { ResourceErrorCodes, ResourceShareLinkErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { ResourceMock } from '@domain/resource/__mocks__/resource.mock';
import { RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { SharePermission } from '@domain/resource-share/resource-share.interface';
import { ResourceShareLinkMock } from '@domain/resource-share-link/__mocks__/resource-share-link.mock';
import { RESOURCE_SHARE_LINK_REPOSITORY_TOKEN } from '@domain/resource-share-link/resource-share-link.repository';
import { UserMock } from '@domain/user/__mocks__/user.mock';

import { GenerateResourceShareLinkUseCase } from '../generate-resource-share-link.use-case';

describe('Use Cases -> Resource Share Link -> Generate', () => {
  let generateResourceShareLinkUseCase: GenerateResourceShareLinkUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ userId: user.id });
  const shareLink = new ResourceShareLinkMock({ resourceId: resource.id });

  const resourceRepositoryMock = {
    findOne: jest.fn()
  };

  const resourceShareLinkRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GenerateResourceShareLinkUseCase,
        {
          provide: RESOURCE_REPOSITORY_TOKEN,
          useValue: resourceRepositoryMock
        },
        {
          provide: RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
          useValue: resourceShareLinkRepositoryMock
        }
      ]
    }).compile();

    generateResourceShareLinkUseCase = module.get<GenerateResourceShareLinkUseCase>(GenerateResourceShareLinkUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create share link when no existing link', async () => {
    resourceRepositoryMock.findOne.mockResolvedValue(resource);
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(null);
    resourceShareLinkRepositoryMock.create.mockResolvedValue(shareLink);

    const input = { resourceId: resource.id, permission: SharePermission.READ, userId: user.id };

    const result = await generateResourceShareLinkUseCase.execute(input);

    expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.resourceId });
    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith({ resourceId: input.resourceId });
    expect(resourceShareLinkRepositoryMock.create).toHaveBeenCalledWith({
      resourceId: input.resourceId,
      permission: input.permission
    });
    expect(resourceShareLinkRepositoryMock.update).not.toHaveBeenCalled();
    expect(result).toEqual(shareLink);
  });

  it('should update existing share link when link already exists', async () => {
    const updatedShareLink = new ResourceShareLinkMock({ ...shareLink, permission: SharePermission.EDIT });
    resourceRepositoryMock.findOne.mockResolvedValue(resource);
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLink);
    resourceShareLinkRepositoryMock.update.mockResolvedValue(updatedShareLink);

    const input = { resourceId: resource.id, permission: SharePermission.EDIT, userId: user.id };

    const result = await generateResourceShareLinkUseCase.execute(input);

    expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.resourceId });
    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith({ resourceId: input.resourceId });
    expect(resourceShareLinkRepositoryMock.update).toHaveBeenCalledWith(
      { id: shareLink.id },
      { permission: input.permission }
    );
    expect(resourceShareLinkRepositoryMock.create).not.toHaveBeenCalled();
    expect(result).toEqual(shareLink);
  });

  it('should throw NOT_FOUND when resource does not exist', async () => {
    resourceRepositoryMock.findOne.mockResolvedValue(null);

    const input = { resourceId: resource.id, permission: SharePermission.READ, userId: user.id };

    await expect(generateResourceShareLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceErrorCodes.NOT_FOUND)
    );
    expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.resourceId });
    expect(resourceShareLinkRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(resourceShareLinkRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw INVALID_PERMISSION_TO_GENERATE when user is not the resource owner', async () => {
    const otherUser = new UserMock();
    resourceRepositoryMock.findOne.mockResolvedValue(resource);

    const input = { resourceId: resource.id, permission: SharePermission.READ, userId: otherUser.id };

    await expect(generateResourceShareLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.INVALID_PERMISSION_TO_GENERATE)
    );
    expect(resourceRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.resourceId });
    expect(resourceShareLinkRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(resourceShareLinkRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw NOT_UPDATED when update fails on existing link', async () => {
    resourceRepositoryMock.findOne.mockResolvedValue(resource);
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLink);
    resourceShareLinkRepositoryMock.update.mockResolvedValue(null);

    const input = { resourceId: resource.id, permission: SharePermission.EDIT, userId: user.id };

    await expect(generateResourceShareLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.NOT_UPDATED)
    );
    expect(resourceShareLinkRepositoryMock.update).toHaveBeenCalledWith(
      { id: shareLink.id },
      { permission: input.permission }
    );
    expect(resourceShareLinkRepositoryMock.create).not.toHaveBeenCalled();
  });
});
