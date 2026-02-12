import { Inject, Injectable } from '@nestjs/common';

import { TaskEntity } from '@domain/entities/task/task.entity';
import {
  TASK_REPOSITORY_TOKEN,
  FilterTask,
  ITaskRepository,
  RelationsTask
} from '@domain/repositories/task/task.repository';

type FindTasksInput = {
  filters?: FilterTask;
  relations?: RelationsTask;
};

type FindTasksOutput = {
  tasks: TaskEntity[];
  total: number;
};

@Injectable()
export class FindTasksUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(input: FindTasksInput = {}): Promise<FindTasksOutput> {
    const { filters, relations } = input;

    const { tasks, total } = await this.taskRepository.find(filters, relations);

    return {
      tasks: tasks.map((task) => new TaskEntity(task)),
      total
    };
  }
}
