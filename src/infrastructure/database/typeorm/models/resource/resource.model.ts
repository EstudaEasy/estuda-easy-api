import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IResource, ResourceType } from '@domain/entities/resource/resource.interface';

import { DeckModel } from '../deck/deck.model';
import { QuizModel } from '../quiz/quiz.model';
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
  @JoinColumn({ name: 'user_id', foreignKeyConstraintName: 'fk_resources_users' })
  user?: UserModel;

  @OneToOne(() => DeckModel, (deck) => deck.resource)
  deck?: DeckModel;

  @OneToOne(() => QuizModel, (quiz) => quiz.resource)
  quiz?: QuizModel;

  @OneToMany(() => ResourceShareModel, (share) => share.resource)
  shares?: ResourceShareModel[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
