import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { IGroup } from '@domain/entities/group/group.interface';

import { GroupMemberModel } from '../group-member/group-member.model';
import { ResourceShareModel } from '../resource-share/resource-share.model';

@Entity({ name: 'groups' })
export class GroupModel implements IGroup {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'name', type: 'varchar' })
  name: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;

  @Column({ name: 'invite_code', type: 'varchar', unique: true })
  inviteCode: string;

  @OneToMany(() => GroupMemberModel, (member) => member.group)
  members?: GroupMemberModel[];

  @OneToMany(() => ResourceShareModel, (share) => share.group)
  resources?: ResourceShareModel[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
