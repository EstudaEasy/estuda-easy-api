import { Test } from '@nestjs/testing';

import { Exception, GroupErrorCodes } from '@application/errors';
import { GroupMock } from '@domain/entities/group/__mocks__/group.mock';
import { GROUP_REPOSITORY_TOKEN } from '@domain/repositories/group/group.repository';

import { FindOneGroupUseCase } from '../find-one-group.use-case';

describe('Use Cases -> Group -> Find One', () => {
  let findOneGroupUseCase: FindOneGroupUseCase;

  const group = new GroupMock();

  const groupRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneGroupUseCase,
        {
          provide: GROUP_REPOSITORY_TOKEN,
          useValue: groupRepositoryMock
        }
      ]
    }).compile();

    findOneGroupUseCase = module.get<FindOneGroupUseCase>(FindOneGroupUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one group by filters', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);

    const input = {
      filters: { id: group.id }
    };

    const result = await findOneGroupUseCase.execute(input);

    expect(groupRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
    expect(result).toEqual(group);
  });

  it('should find one group with relations', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(group);

    const input = {
      filters: { id: group.id },
      relations: { members: true }
    };

    const result = await findOneGroupUseCase.execute(input);

    expect(groupRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(group);
  });

  it('should throw NOT_FOUND when group does not exist', async () => {
    groupRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: 'non-existent-id' }
    };

    await expect(findOneGroupUseCase.execute(input)).rejects.toThrow(new Exception(GroupErrorCodes.NOT_FOUND));
  });
});
