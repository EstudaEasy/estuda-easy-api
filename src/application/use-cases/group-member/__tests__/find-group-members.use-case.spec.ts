import { Test } from '@nestjs/testing';

import { GroupMemberMock } from '@domain/entities/group-member/__mocks__/group-member.mock';
import { GROUP_MEMBER_REPOSITORY_TOKEN } from '@domain/repositories/group-member/group-member.repository';

import { FindGroupMembersUseCase } from '../find-group-members.use-case';

describe('Use Cases -> Group Member -> Find', () => {
  let findGroupMembersUseCase: FindGroupMembersUseCase;

  const members = GroupMemberMock.getList(2);
  const total = members.length;

  const groupMemberRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindGroupMembersUseCase,
        {
          provide: GROUP_MEMBER_REPOSITORY_TOKEN,
          useValue: groupMemberRepositoryMock
        }
      ]
    }).compile();

    findGroupMembersUseCase = module.get<FindGroupMembersUseCase>(FindGroupMembersUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find group members', async () => {
    groupMemberRepositoryMock.find.mockResolvedValue({ members, total });

    const input = {
      filters: { groupId: members[0].groupId },
      relations: { user: true }
    };

    const result = await findGroupMembersUseCase.execute(input);

    expect(groupMemberRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.members).toEqual(members);
    expect(result.total).toBe(total);
  });

  it('should find group members with only filters', async () => {
    const filteredMembers = [members[0]];
    groupMemberRepositoryMock.find.mockResolvedValue({ members: filteredMembers, total: 1 });

    const input = {
      filters: { userId: members[0].userId }
    };

    const result = await findGroupMembersUseCase.execute(input);

    expect(groupMemberRepositoryMock.find).toHaveBeenCalledWith(input.filters, undefined);
    expect(result.members).toEqual(filteredMembers);
    expect(result.total).toBe(1);
  });
});
