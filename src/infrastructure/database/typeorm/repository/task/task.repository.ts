import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateTask,
  TASK_REPOSITORY_TOKEN,
  FilterTask,
  ITaskRepository,
  RelationsTask,
  UpdateTask
} from '@domain/repositories/task/task.repository';

import { TaskModel } from '../../models/task/task.model';

@Injectable()
export class TaskRepository implements ITaskRepository {
  constructor(
    @InjectRepository(TaskModel)
    private readonly repository: Repository<TaskModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateTask): Promise<TaskModel> {
    const task = this.repository.create(data);
    return await this.repository.save(task);
  }

  async find(filters?: FilterTask, relations?: RelationsTask): Promise<{ tasks: TaskModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [tasks, total] = await this.repository.findAndCount({ where, relations });
    return { tasks, total };
  }

  async findOne(filters: FilterTask, relations?: RelationsTask): Promise<TaskModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterTask, data: UpdateTask): Promise<TaskModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterTask): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([TaskModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: TASK_REPOSITORY_TOKEN,
      useClass: TaskRepository
    }
  ],
  exports: [TASK_REPOSITORY_TOKEN]
})
export class TaskRepositoryModule {}
