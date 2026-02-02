import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

import { IQuiz } from '@domain/entities/quiz/quiz.interface';

import { QuizItemModel } from '../quiz-item/quiz-item.model';

@Entity({ name: 'quizzes' })
export class QuizModel implements IQuiz {
  @PrimaryGeneratedColumn('uuid', { name: 'id' })
  id: string;

  @Column({ name: 'title', type: 'varchar' })
  title: string;

  @Column({ name: 'description', type: 'varchar', nullable: true })
  description?: string;

  @OneToMany(() => QuizItemModel, (quizItem) => quizItem.quiz)
  items: QuizItemModel[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
