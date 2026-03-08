import { Inject, Injectable } from '@nestjs/common';

import { TaskErrorCodes, Exception } from '@application/errors';
import { ResourceType } from '@domain/resource/resource.interface';
import { IResourceRepository, RESOURCE_REPOSITORY_TOKEN } from '@domain/resource/resource.repository';
import { TaskEntity } from '@domain/task/task.entity';
import { CreateTask, TASK_REPOSITORY_TOKEN, ITaskRepository } from '@domain/task/task.repository';

export interface CreateTaskInput {
  data: Omit<CreateTask, 'resource'>;
  userId: number;
}

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(RESOURCE_REPOSITORY_TOKEN)
    private readonly resourceRepository: IResourceRepository,
    @Inject(TASK_REPOSITORY_TOKEN)
    private readonly taskRepository: ITaskRepository
  ) {}

  async execute(input: CreateTaskInput): Promise<TaskEntity> {
    const { data, userId } = input;

    if (data.startDate && data.endDate && data.startDate >= data.endDate) {
      throw new Exception(TaskErrorCodes.INVALID_DATE_RANGE);
    }

    const resource = await this.resourceRepository.create({
      type: ResourceType.TASK,
      userId
    });

    const task = await this.taskRepository.create({
      ...data,
      resource
    });

    return new TaskEntity(task);
  }
}
