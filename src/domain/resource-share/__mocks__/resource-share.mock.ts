import { faker } from '@faker-js/faker';

import { IResourceShare, SharePermission } from '../resource-share.interface';

export class ResourceShareMock implements IResourceShare {
  public readonly id: number;
  public readonly permission: SharePermission;
  public readonly resourceId: string;
  public readonly groupId?: string;
  public readonly userId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IResourceShare>) {
    this.id = faker.number.int({ min: 1, max: 1000 });
    this.resourceId = faker.string.uuid();
    this.userId = faker.number.int({ min: 1, max: 1000 });
    this.permission = faker.helpers.enumValue(SharePermission);
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): ResourceShareMock[] {
    return Array.from({ length }, () => new ResourceShareMock());
  }
}
