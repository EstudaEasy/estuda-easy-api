import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, Unique } from 'typeorm';

import { IResourceFavorite } from '@domain/resource-favorite/resource-favorite.interface';

import { ResourceModel } from '../resource/resource.model';
import { UserModel } from '../user/user.model';

@Entity({ name: 'resource_favorites' })
@Unique('uq_user_resource_favorite', ['userId', 'resourceId'])
export class ResourceFavoriteModel implements IResourceFavorite {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_resource_favorites_users' })
  user?: UserModel;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: string;

  @ManyToOne(() => ResourceModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id', foreignKeyConstraintName: 'fk_resource_favorites_resources' })
  resource?: ResourceModel;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;
}
