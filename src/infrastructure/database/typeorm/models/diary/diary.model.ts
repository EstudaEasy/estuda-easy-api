import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IDiary } from '@domain/diary/diary.interface';

import { ResourceModel } from '../resource/resource.model';

@Entity({ name: 'diaries' })
export class DiaryModel implements IDiary {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'content', type: 'varchar' })
  content: string;

  @Column({ name: 'audio_url', type: 'varchar', nullable: true })
  audioUrl?: string;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: string;

  @OneToOne(() => ResourceModel, (resource) => resource.diary, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id', foreignKeyConstraintName: 'fk_diaries_resources' })
  resource?: ResourceModel;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
