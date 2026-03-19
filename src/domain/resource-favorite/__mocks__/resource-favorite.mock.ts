import { faker } from '@faker-js/faker';

import { IResourceFavorite } from '../resource-favorite.interface';

export class ResourceFavoriteMock implements IResourceFavorite {
  public readonly id: string;
  public readonly userId: number;
  public readonly resourceId: string;
  public readonly createdAt: Date;

  constructor(partial?: Partial<IResourceFavorite>) {
    this.id = faker.string.uuid();
    this.userId = faker.number.int({ min: 1, max: 1000 });
    this.resourceId = faker.string.uuid();
    this.createdAt = faker.date.past();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): ResourceFavoriteMock[] {
    return Array.from({ length }, () => new ResourceFavoriteMock());
  }
}
