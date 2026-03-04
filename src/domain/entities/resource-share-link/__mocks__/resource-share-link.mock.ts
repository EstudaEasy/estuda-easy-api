import { faker } from '@faker-js/faker';

import { SharePermission } from '../../resource-share/resource-share.interface';
import { IResourceShareLink } from '../resource-share-link.interface';

export class ResourceShareLinkMock implements IResourceShareLink {
  public readonly id: string;
  public readonly resourceId: string;
  public readonly permission: SharePermission;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IResourceShareLink>) {
    this.id = faker.string.uuid();
    this.resourceId = faker.string.uuid();
    this.permission = faker.helpers.enumValue(SharePermission);
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();

    Object.assign(this, partial);
  }

  public static getList(length: number = 2): ResourceShareLinkMock[] {
    return Array.from({ length }, () => new ResourceShareLinkMock());
  }
}
