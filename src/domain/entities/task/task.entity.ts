import { ResourceEntity } from '../resource/resource.entity';

import { ITask, TaskStatus } from './task.interface';

export class TaskEntity implements ITask {
  constructor(props: ITask) {
    Object.assign(this, props);
  }

  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  resourceId: string;
  resource?: ResourceEntity;
  createdAt: Date;
  updatedAt: Date;
}
