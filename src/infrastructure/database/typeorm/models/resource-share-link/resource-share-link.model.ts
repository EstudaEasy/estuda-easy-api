import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { IResourceShareLink } from '@domain/entities/resource-share-link/resource-share-link.interface';

import { ResourceModel } from '../resource/resource.model';

@Entity({ name: 'resource_share_links' })
export class ResourceShareLinkModel implements IResourceShareLink {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: string;

  @OneToOne(() => ResourceModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id', foreignKeyConstraintName: 'fk_share_links_resources' })
  resource?: ResourceModel;

  @Column({ type: 'enum', enum: SharePermission, name: 'permission', enumName: 'share_permission_enum' })
  permission: SharePermission;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
