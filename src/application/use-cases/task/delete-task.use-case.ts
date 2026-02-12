import { Inject, Injectable } from '@nestjs/common';

import { TaskErrorCodes, Exception } from '@application/errors';
import { TASK_REPOSITORY_TOKEN, FilterTask, ITaskRepository } from '@domain/repositories/task/task.repository';

type DeleteTaskInput = {
  filters: FilterTask;
};

@Injectable()
export class DeleteTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(input: DeleteTaskInput): Promise<void> {
    const { filters } = input;

    const task = await this.taskRepository.findOne(filters);
    if (!task) {
      throw new Exception(TaskErrorCodes.NOT_FOUND);
    }

    const deleted = await this.taskRepository.delete(filters);
    if (!deleted) {
      throw new Exception(TaskErrorCodes.NOT_DELETED);
    }
  }
}
