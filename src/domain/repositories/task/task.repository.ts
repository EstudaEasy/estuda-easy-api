import { ITask } from '@domain/entities/task/task.interface';
import { DomainFilter } from '@shared/types';

export type CreateTask = Omit<ITask, 'id' | 'resourceId' | 'createdAt' | 'updatedAt'>;
export type UpdateTask = Partial<Omit<CreateTask, 'resource'>>;
export type FilterTask = DomainFilter<ITask> | DomainFilter<ITask>[];
export type RelationsTask = { resource?: boolean };

export const TASK_REPOSITORY_TOKEN = 'TaskRepositoryToken';

export interface ITaskRepository {
  create(data: CreateTask): Promise<ITask>;
  find(filters?: FilterTask, relations?: RelationsTask): Promise<{ tasks: ITask[]; total: number }>;
  findOne(filters: FilterTask, relations?: RelationsTask): Promise<ITask | null>;
  update(filters: FilterTask, data: UpdateTask): Promise<ITask | null>;
  delete(filters: FilterTask): Promise<boolean>;
}
