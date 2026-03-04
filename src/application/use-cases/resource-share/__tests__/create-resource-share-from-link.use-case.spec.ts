import { Test } from '@nestjs/testing';

import { Exception, ResourceShareLinkErrorCodes } from '@application/errors';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';
import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';
import { ResourceShareLinkMock } from '@domain/entities/resource-share-link/__mocks__/resource-share-link.mock';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { RESOURCE_SHARE_REPOSITORY_TOKEN } from '@domain/repositories/resource-share/resource-share.repository';
import { RESOURCE_SHARE_LINK_REPOSITORY_TOKEN } from '@domain/repositories/resource-share-link/resource-share-link.repository';

import { CreateResourceShareFromLinkUseCase } from '../create-resource-share-from-link.use-case';

describe('Use Cases -> Resource Share -> Create From Link', () => {
  let createResourceShareFromLinkUseCase: CreateResourceShareFromLinkUseCase;

  const owner = new UserMock();
  const resource = new ResourceMock({ userId: owner.id });
  const shareLink = new ResourceShareLinkMock({ resourceId: resource.id });
  const shareLinkWithResource = { ...shareLink, resource };
  const share = new ResourceShareMock({ resourceId: shareLink.resourceId, permission: shareLink.permission });

  const resourceShareLinkRepositoryMock = {
    findOne: jest.fn()
  };

  const resourceShareRepositoryMock = {
    findOne: jest.fn(),
    create: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateResourceShareFromLinkUseCase,
        {
          provide: RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
          useValue: resourceShareLinkRepositoryMock
        },
        {
          provide: RESOURCE_SHARE_REPOSITORY_TOKEN,
          useValue: resourceShareRepositoryMock
        }
      ]
    }).compile();

    createResourceShareFromLinkUseCase = module.get<CreateResourceShareFromLinkUseCase>(
      CreateResourceShareFromLinkUseCase
    );
  });

  afterEach(() => jest.clearAllMocks());

  it('should create resource share when no existing share', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLinkWithResource);
    resourceShareRepositoryMock.findOne.mockResolvedValue(null);
    resourceShareRepositoryMock.create.mockResolvedValue(share);

    const input = { linkId: shareLink.id, userId: share.userId };

    const result = await createResourceShareFromLinkUseCase.execute(input);

    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.linkId }, { resource: true });
    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({
      resourceId: shareLink.resourceId,
      userId: input.userId
    });
    expect(resourceShareRepositoryMock.create).toHaveBeenCalledWith({
      userId: input.userId,
      resourceId: shareLink.resourceId,
      permission: shareLink.permission
    });
    expect(result).toEqual(share);
  });

  it('should update existing resource share when share already exists', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLinkWithResource);
    resourceShareRepositoryMock.findOne.mockResolvedValue(share);
    resourceShareRepositoryMock.update.mockResolvedValue(share);

    const input = { linkId: shareLink.id, userId: share.userId };

    const result = await createResourceShareFromLinkUseCase.execute(input);

    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.linkId }, { resource: true });
    expect(resourceShareRepositoryMock.findOne).toHaveBeenCalledWith({
      resourceId: shareLink.resourceId,
      userId: input.userId
    });
    expect(resourceShareRepositoryMock.update).toHaveBeenCalledWith(
      { id: share.id },
      { permission: shareLink.permission }
    );
    expect(resourceShareRepositoryMock.create).not.toHaveBeenCalled();
    expect(result).toEqual(share);
  });

  it('should throw NOT_FOUND when share link does not exist', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(null);

    const input = { linkId: shareLink.id, userId: share.userId };

    await expect(createResourceShareFromLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.NOT_FOUND)
    );
    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.linkId }, { resource: true });
    expect(resourceShareRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(resourceShareRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw OWNER_CANNOT_JOIN when user is the resource owner', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLinkWithResource);

    const input = { linkId: shareLink.id, userId: owner.id };

    await expect(createResourceShareFromLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.OWNER_CANNOT_JOIN)
    );
    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith({ id: input.linkId }, { resource: true });
    expect(resourceShareRepositoryMock.findOne).not.toHaveBeenCalled();
    expect(resourceShareRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should throw NOT_UPDATED when update fails on existing share', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLinkWithResource);
    resourceShareRepositoryMock.findOne.mockResolvedValue(share);
    resourceShareRepositoryMock.update.mockResolvedValue(null);

    const input = { linkId: shareLink.id, userId: share.userId };

    await expect(createResourceShareFromLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.NOT_UPDATED)
    );
    expect(resourceShareRepositoryMock.update).toHaveBeenCalledWith(
      { id: share.id },
      { permission: shareLink.permission }
    );
  });
});
