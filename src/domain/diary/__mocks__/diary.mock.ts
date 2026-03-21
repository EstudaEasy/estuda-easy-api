import { faker } from '@faker-js/faker';

import { IDiary } from '../diary.interface';

export class DiaryMock implements IDiary {
  public readonly id: string;
  public readonly title: string;
  public readonly content: string;
  public readonly audioUrl?: string;
  public readonly resourceId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<IDiary>) {
    this.id = faker.string.uuid();
    this.title = faker.lorem.words(5);
    this.content = faker.lorem.paragraphs(3);
    this.audioUrl = faker.helpers.maybe(() => faker.internet.url(), { probability: 0.5 });
    this.resourceId = faker.string.uuid();
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): IDiary[] {
    return Array.from({ length }, () => new DiaryMock());
  }
}
