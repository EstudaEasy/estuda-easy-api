import { Test } from '@nestjs/testing';

import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';
import { GROUP_REPOSITORY_TOKEN } from '@domain/repositories/group/group.repository';

import { FindGroupsUseCase } from '../find-groups.use-case';

describe('Use Cases -> Group -> Find', () => {
  let findGroupsUseCase: FindGroupsUseCase;

  const groups = GroupMock.getList(3);

  const groupRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindGroupsUseCase,
        {
          provide: GROUP_REPOSITORY_TOKEN,
          useValue: groupRepositoryMock
        }
      ]
    }).compile();

    findGroupsUseCase = module.get<FindGroupsUseCase>(FindGroupsUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find groups without filters', async () => {
    groupRepositoryMock.find.mockResolvedValue({
      groups,
      total: groups.length
    });

    const result = await findGroupsUseCase.execute();

    expect(groupRepositoryMock.find).toHaveBeenCalledWith(undefined, undefined);
    expect(result.groups).toHaveLength(groups.length);
    expect(result.total).toBe(groups.length);
  });

  it('should find groups with filters', async () => {
    const filteredGroups = [groups[0]];
    groupRepositoryMock.find.mockResolvedValue({
      groups: filteredGroups,
      total: filteredGroups.length
    });

    const input = {
      filters: { id: groups[0].id }
    };

    const result = await findGroupsUseCase.execute(input);

    expect(groupRepositoryMock.find).toHaveBeenCalledWith(input.filters, undefined);
    expect(result.groups).toHaveLength(1);
    expect(result.total).toBe(1);
  });

  it('should find groups with relations', async () => {
    groupRepositoryMock.find.mockResolvedValue({
      groups,
      total: groups.length
    });

    const input = {
      relations: { members: true }
    };

    const result = await findGroupsUseCase.execute(input);

    expect(groupRepositoryMock.find).toHaveBeenCalledWith(undefined, input.relations);
    expect(result.groups).toHaveLength(groups.length);
  });

  it('should return empty array when no groups found', async () => {
    groupRepositoryMock.find.mockResolvedValue({
      groups: [],
      total: 0
    });

    const result = await findGroupsUseCase.execute();

    expect(result.groups).toHaveLength(0);
    expect(result.total).toBe(0);
  });
});
