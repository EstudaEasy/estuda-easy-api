import { Test } from '@nestjs/testing';

import { Exception, ResourceShareLinkErrorCodes } from '@application/errors';
import { ResourceShareLinkMock } from '@domain/resource-share-link/__mocks__/resource-share-link.mock';
import { RESOURCE_SHARE_LINK_REPOSITORY_TOKEN } from '@domain/resource-share-link/resource-share-link.repository';

import { FindOneResourceShareLinkUseCase } from '../find-one-resource-share-link.use-case';

describe('Use Cases -> Resource Share Link -> Find One', () => {
  let findOneResourceShareLinkUseCase: FindOneResourceShareLinkUseCase;

  const shareLink = new ResourceShareLinkMock();

  const resourceShareLinkRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneResourceShareLinkUseCase,
        {
          provide: RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
          useValue: resourceShareLinkRepositoryMock
        }
      ]
    }).compile();

    findOneResourceShareLinkUseCase = module.get<FindOneResourceShareLinkUseCase>(FindOneResourceShareLinkUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find resource share link', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLink);

    const input = { filters: { id: shareLink.id } };

    const result = await findOneResourceShareLinkUseCase.execute(input);

    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
    expect(result).toEqual(shareLink);
  });

  it('should find resource share link with relations', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(shareLink);

    const input = { filters: { resourceId: shareLink.resourceId }, relations: { resource: true } };

    const result = await findOneResourceShareLinkUseCase.execute(input);

    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(shareLink);
  });

  it('should throw NOT_FOUND when share link does not exist', async () => {
    resourceShareLinkRepositoryMock.findOne.mockResolvedValue(null);

    const input = { filters: { id: shareLink.id } };

    await expect(findOneResourceShareLinkUseCase.execute(input)).rejects.toThrow(
      new Exception(ResourceShareLinkErrorCodes.NOT_FOUND)
    );
    expect(resourceShareLinkRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
