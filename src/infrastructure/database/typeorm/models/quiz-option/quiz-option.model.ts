import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

import { IQuizOption } from '@domain/entities/quiz-option/quiz-option.interface';

import { QuizItemModel } from '../quiz-item/quiz-item.model';

@Entity({ name: 'quiz_options' })
export class QuizOptionModel implements IQuizOption {
  @PrimaryGeneratedColumn({ name: 'id', type: 'int' })
  id: number;

  @Column({ name: 'quiz_item_id', type: 'int' })
  quizItemId: number;

  @ManyToOne(() => QuizItemModel, (quizItem) => quizItem.options, { onDelete: 'CASCADE', orphanedRowAction: 'delete' })
  @JoinColumn({ name: 'quiz_item_id', foreignKeyConstraintName: 'fk_quiz_options_quiz_items' })
  quizItem?: QuizItemModel;

  @Column({ name: 'text', type: 'varchar' })
  text: string;

  @Column({ name: 'is_correct', type: 'boolean' })
  isCorrect: boolean;

  @Column({ name: 'position', type: 'int' })
  position: number;
}
