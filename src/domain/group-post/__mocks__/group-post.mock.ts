import { faker } from '@faker-js/faker';

import { IGroupPost } from '../group-post.interface';

export class GroupPostMock implements IGroupPost {
  public readonly id: string;
  public readonly content: string;
  public readonly groupId: string;
  public readonly authorId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IGroupPost>) {
    this.id = faker.string.uuid();
    this.content = faker.lorem.paragraph();
    this.groupId = faker.string.uuid();
    this.authorId = faker.number.int({ min: 1, max: 1000 });
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): GroupPostMock[] {
    return Array.from({ length }, () => new GroupPostMock());
  }
}
