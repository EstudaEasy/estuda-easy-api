import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IResource, ResourceType } from '@domain/entities/resource/resource.interface';

import { ResourceShareModel } from '../resource-share/resource-share.model';
import { UserModel } from '../user/user.model';

@Entity({ name: 'resources' })
export class ResourceModel implements IResource {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ type: 'enum', enum: ResourceType, name: 'type' })
  type: ResourceType;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_resources_user' })
  user?: UserModel;

  @OneToMany(() => ResourceShareModel, (share) => share.resource)
  shares?: ResourceShareModel[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
