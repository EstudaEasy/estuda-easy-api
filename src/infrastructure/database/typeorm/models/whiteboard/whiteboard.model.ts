import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IWhiteboard } from '@domain/entities/whiteboard/whiteboard.interface';

import { ResourceModel } from '../resource/resource.model';

@Entity({ name: 'whiteboards' })
export class WhiteboardModel implements IWhiteboard {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'content', type: 'jsonb' })
  content: any;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: string;

  @OneToOne(() => ResourceModel, (resource) => resource.whiteboard, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id', foreignKeyConstraintName: 'fk_whiteboards_resources' })
  resource?: ResourceModel;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
