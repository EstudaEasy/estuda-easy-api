import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn
} from 'typeorm';

import { IQuiz } from '@domain/entities/quiz/quiz.interface';

import { QuizItemModel } from '../quiz-item/quiz-item.model';
import { ResourceModel } from '../resource/resource.model';

@Entity({ name: 'quizzes' })
export class QuizModel implements IQuiz {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;

  @Column({ name: 'resource_id', type: 'uuid' })
  resourceId: string;

  @OneToOne(() => ResourceModel, (resource) => resource.quiz, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'resource_id', foreignKeyConstraintName: 'fk_quizzes_resources' })
  resource?: ResourceModel;

  @OneToMany(() => QuizItemModel, (quizItem) => quizItem.quiz)
  items: QuizItemModel[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
