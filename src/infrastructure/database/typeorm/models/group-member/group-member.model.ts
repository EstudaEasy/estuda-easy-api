import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn
} from 'typeorm';

import { GroupMemberRole, IGroupMember } from '@domain/entities/group-member/group-member.interface';

import { GroupModel } from '../group/group.model';
import { UserModel } from '../user/user.model';

@Entity({ name: 'group_members' })
@Unique('uq_group_members_user_group', ['userId', 'groupId'])
export class GroupMemberModel implements IGroupMember {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'role', type: 'enum', enum: GroupMemberRole })
  role: GroupMemberRole;

  @Column({ name: 'group_id', type: 'uuid' })
  groupId: string;

  @ManyToOne(() => GroupModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'group_id', foreignKeyConstraintName: 'fk_group_members_group' })
  group?: GroupModel;

  @Column({ name: 'user_id', type: 'int' })
  userId: number;

  @ManyToOne(() => UserModel, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_group_members_user' })
  user?: UserModel;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
