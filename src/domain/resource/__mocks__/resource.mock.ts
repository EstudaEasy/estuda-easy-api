import { faker } from '@faker-js/faker';

import { IResource, ResourceType } from '../resource.interface';

export class ResourceMock implements IResource {
  public readonly id: string;
  public readonly type: ResourceType;
  public readonly userId: number;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IResource>) {
    this.id = faker.string.uuid();
    this.type = faker.helpers.enumValue(ResourceType);
    this.userId = faker.number.int({ min: 1, max: 1000 });
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): IResource[] {
    return Array.from({ length }, () => new ResourceMock());
  }
}
