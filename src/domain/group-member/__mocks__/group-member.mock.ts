import { faker } from '@faker-js/faker';

import { GroupMemberRole, IGroupMember } from '../group-member.interface';

export class GroupMemberMock implements IGroupMember {
  public readonly id: number;
  public readonly role: GroupMemberRole;
  public readonly groupId: string;
  public readonly userId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IGroupMember>) {
    this.id = faker.number.int({ min: 1, max: 1000 });
    this.role = faker.helpers.enumValue(GroupMemberRole);
    this.groupId = faker.string.uuid();
    this.userId = faker.number.int({ min: 1, max: 1000 });
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): GroupMemberMock[] {
    return Array.from({ length }, () => new GroupMemberMock());
  }
}
