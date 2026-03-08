import { IResource } from '../resource/resource.interface';

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export interface ITask {
  id: string;
  name: string;
  description?: string;
  status: TaskStatus;
  startDate?: Date;
  endDate?: Date;
  resourceId: string;
  resource?: IResource;
  createdAt: Date;
  updatedAt: Date;
}
