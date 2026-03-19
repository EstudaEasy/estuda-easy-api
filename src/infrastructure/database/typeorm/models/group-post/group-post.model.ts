import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IGroupPost } from '@domain/group-post/group-post.interface';

import { GroupModel } from '../group/group.model';
import { UserModel } from '../user/user.model';

@Entity({ name: 'group_posts' })
export class GroupPostModel implements IGroupPost {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'content', type: 'text' })
  content: string;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @ManyToOne(() => GroupModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id', foreignKeyConstraintName: 'fk_group_posts_groups' })
  group?: GroupModel;

  @Column({ name: 'author_id', type: 'int' })
  authorId: number;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id', foreignKeyConstraintName: 'fk_group_posts_users' })
  author?: UserModel;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
