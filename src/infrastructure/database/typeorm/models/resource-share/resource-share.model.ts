import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IResourceShare, SharePermission } from '@domain/entities/resource-share/resource-share.interface';

import { ResourceModel } from '../resource/resource.model';
import { UserModel } from '../user/user.model';

@Entity({ name: 'resource_shares' })
export class ResourceShareModel implements IResourceShare {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ type: 'enum', enum: SharePermission, name: 'permission', enumName: 'share_permission_enum' })
  permission: SharePermission;

  @Column({ name: 'resource_id', type: 'int' })
  resourceId: number;

  @ManyToOne(() => ResourceModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id', foreignKeyConstraintName: 'fk_resource_shares_resource' })
  resource?: ResourceModel;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_resource_shares_user' })
  user?: UserModel;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
