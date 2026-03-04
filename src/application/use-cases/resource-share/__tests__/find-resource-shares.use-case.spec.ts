import { Test } from '@nestjs/testing';

import { ResourceShareMock } from '@domain/entities/resource-share/__mocks__/resource-share.mock';
import { RESOURCE_SHARE_REPOSITORY_TOKEN } from '@domain/repositories/resource-share/resource-share.repository';

import { FindResourceSharesUseCase } from '../find-resource-shares.use-case';

describe('Use Cases -> Resource Share -> Find', () => {
  let findResourceSharesUseCase: FindResourceSharesUseCase;

  const shares = ResourceShareMock.getList(2);
  const total = shares.length;

  const resourceShareRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindResourceSharesUseCase,
        {
          provide: RESOURCE_SHARE_REPOSITORY_TOKEN,
          useValue: resourceShareRepositoryMock
        }
      ]
    }).compile();

    findResourceSharesUseCase = module.get<FindResourceSharesUseCase>(FindResourceSharesUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find resource shares', async () => {
    resourceShareRepositoryMock.find.mockResolvedValue({ shares, total });

    const result = await findResourceSharesUseCase.execute();

    expect(resourceShareRepositoryMock.find).toHaveBeenCalledWith(undefined, undefined);
    expect(result.shares).toEqual(shares);
    expect(result.total).toBe(total);
  });

  it('should find resource shares with filters', async () => {
    const filteredShares = [shares[0]];
    resourceShareRepositoryMock.find.mockResolvedValue({ shares: filteredShares, total: 1 });

    const input = {
      filters: { resourceId: shares[0].resourceId },
      relations: { user: true }
    };

    const result = await findResourceSharesUseCase.execute(input);

    expect(resourceShareRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.shares).toEqual(filteredShares);
    expect(result.total).toBe(1);
  });
});
