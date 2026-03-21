import { Module } from '@nestjs/common';

import { ResourceRepositoryModule } from '@database/typeorm/repository/resource/resource.repository';
import { TaskRepositoryModule } from '@database/typeorm/repository/task/task.repository';

import { CreateTaskUseCase } from './create-task.use-case';
import { DeleteTaskUseCase } from './delete-task.use-case';
import { FindOneTaskUseCase } from './find-one-task.use-case';
import { FindTasksUseCase } from './find-tasks.use-case';
import { UpdateTaskUseCase } from './update-task.use-case';

@Module({
  imports: [TaskRepositoryModule, ResourceRepositoryModule],
  providers: [CreateTaskUseCase, FindTasksUseCase, FindOneTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase],
  exports: [CreateTaskUseCase, FindTasksUseCase, FindOneTaskUseCase, UpdateTaskUseCase, DeleteTaskUseCase]
})
export class TaskUseCasesModule {}
