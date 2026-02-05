import { faker } from '@faker-js/faker';

import { IGroup } from '../group.interface';

export class GroupMock implements IGroup {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly inviteCode: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IGroup>) {
    this.id = faker.string.uuid();
    this.name = faker.company.name();
    this.description = faker.lorem.sentence();
    this.inviteCode = faker.string.alphanumeric(7).toUpperCase();
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): GroupMock[] {
    return Array.from({ length }, () => new GroupMock());
  }
}
