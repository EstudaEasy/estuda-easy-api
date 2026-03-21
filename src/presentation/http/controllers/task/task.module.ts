import { Module } from '@nestjs/common';

import { TaskUseCasesModule } from '@application/use-cases/task/task.use-cases';
import { TaskController } from '@presentation/http/controllers/task/task.controller';

@Module({
  imports: [TaskUseCasesModule],
  controllers: [TaskController]
})
export class TaskModule {}
