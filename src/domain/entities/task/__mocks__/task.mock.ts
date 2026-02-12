import { faker } from '@faker-js/faker';

import { ITask, TaskStatus } from '../task.interface';

export class TaskMock implements ITask {
  public readonly id: string;
  public readonly name: string;
  public readonly description?: string;
  public readonly status: TaskStatus;
  public readonly startDate?: Date;
  public readonly endDate?: Date;
  public readonly resourceId: string;
  public readonly createdAt: Date;
  public readonly updatedAt: Date;

  constructor(partial?: Partial<ITask>) {
    this.id = faker.string.uuid();
    this.name = faker.lorem.words(3);
    this.description = faker.lorem.sentence();
    this.status = faker.helpers.enumValue(TaskStatus);
    this.startDate = faker.date.future();
    this.endDate = faker.date.future({ refDate: this.startDate });
    this.resourceId = faker.string.uuid();
    this.createdAt = faker.date.past();
    this.updatedAt = faker.date.recent();
    Object.assign(this, partial);
  }

  public static getList(length: number = 2): ITask[] {
    return Array.from({ length }, () => new TaskMock());
  }
}
