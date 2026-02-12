import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { ITask, TaskStatus } from '@domain/entities/task/task.interface';

import { ResourceModel } from '../resource/resource.model';

@Entity({ name: 'tasks' })
export class TaskModel implements ITask {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;

  @Column({ type: 'enum', enum: TaskStatus, name: 'status', default: TaskStatus.PENDING })
  status: TaskStatus;

  @Column({ name: 'start_date', type: 'timestamptz', nullable: true })
  startDate?: Date;

  @Column({ name: 'end_date', type: 'timestamptz', nullable: true })
  endDate?: Date;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: string;

  @OneToOne(() => ResourceModel, (resource) => resource.task, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id', foreignKeyConstraintName: 'fk_tasks_resources' })
  resource?: ResourceModel;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
