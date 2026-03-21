import { Inject, Injectable } from '@nestjs/common';

import { TaskErrorCodes } from '@application/errors';
import { Exception } from '@core/exceptions';
import { TaskEntity } from '@domain/task/task.entity';
import { TASK_REPOSITORY_TOKEN, FilterTask, ITaskRepository, RelationsTask } from '@domain/task/task.repository';

type FindOneTaskInput = {
  filters: FilterTask;
  relations?: RelationsTask;
};

@Injectable()
export class FindOneTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(input: FindOneTaskInput): Promise<TaskEntity> {
    const { filters, relations } = input;

    const task = await this.taskRepository.findOne(filters, relations);
    if (!task) {
      throw new Exception(TaskErrorCodes.NOT_FOUND);
    }

    return new TaskEntity(task);
  }
}
