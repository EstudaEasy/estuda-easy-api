import { Inject, Injectable } from '@nestjs/common';

import { TaskErrorCodes, Exception } from '@application/errors';
import { TaskEntity } from '@domain/entities/task/task.entity';
import {
  TASK_REPOSITORY_TOKEN,
  FilterTask,
  ITaskRepository,
  UpdateTask
} from '@domain/repositories/task/task.repository';

type UpdateTaskInput = {
  filters: FilterTask;
  data: UpdateTask;
};

@Injectable()
export class UpdateTaskUseCase {
  constructor(
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(input: UpdateTaskInput): Promise<TaskEntity> {
    const { filters, data } = input;

    const existingTask = await this.taskRepository.findOne(filters);
    if (!existingTask) {
      throw new Exception(TaskErrorCodes.NOT_FOUND);
    }

    const finalStartDate = data.startDate ?? existingTask.startDate;
    const finalEndDate = data.endDate ?? existingTask.endDate;

    if (finalStartDate && finalEndDate && finalStartDate >= finalEndDate) {
      throw new Exception(TaskErrorCodes.INVALID_DATE_RANGE);
    }

    const updatedTask = await this.taskRepository.update(filters, data);
    if (!updatedTask) {
      throw new Exception(TaskErrorCodes.NOT_UPDATED);
    }

    return new TaskEntity(updatedTask);
  }
}
