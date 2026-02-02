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

import { IQuizItem } from '@domain/entities/quiz-item/quiz-item.interface';

import { QuizModel } from '../quiz/quiz.model';
import { QuizOptionModel } from '../quiz-option/quiz-option.model';

@Entity({ name: 'quiz_items' })
export class QuizItemModel implements IQuizItem {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'quiz_id', type: 'varchar' })
  quizId: string;

  @ManyToOne(() => QuizModel, (quiz) => quiz.items, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'quiz_id', foreignKeyConstraintName: 'fk_quiz_items_quiz_id' })
  quiz?: QuizModel;

  @Column({ name: 'question', type: 'varchar' })
  question: string;

  @OneToMany(() => QuizOptionModel, (option) => option.quizItem, { cascade: true })
  options: QuizOptionModel[];

  @Column({ name: 'position', type: 'int' })
  position: number;

  @Column({ name: 'time_limit', type: 'float', nullable: true })
  timeLimit?: number;

  @Column({ name: 'explanation', type: 'varchar', nullable: true })
  explanation?: string;

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
