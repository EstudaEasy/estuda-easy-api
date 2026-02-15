import { faker } from '@faker-js/faker';

import { IWhiteboard } from '../whiteboard.interface';

export class WhiteboardMock implements IWhiteboard {
  public readonly id: string;
  public readonly title: string;
  public readonly content: any;
  public readonly resourceId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IWhiteboard>) {
    this.id = faker.string.uuid();
    this.title = faker.lorem.words(3);
    this.content = {
      shapes: []
    };
    this.resourceId = faker.string.uuid();
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): IWhiteboard[] {
    return Array.from({ length }, () => new WhiteboardMock());
  }
}
