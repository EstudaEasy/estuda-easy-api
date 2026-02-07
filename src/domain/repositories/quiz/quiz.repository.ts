import { IQuiz } from '@domain/entities/quiz/quiz.interface';
import { DomainFilter } from '@shared/types';

export type CreateQuiz = Omit<IQuiz, 'id' | 'items' | 'resourceId' | 'createdAt' | 'updatedAt'>;
export type UpdateQuiz = Partial<CreateQuiz>;
export type FilterQuiz = DomainFilter<IQuiz> | DomainFilter<IQuiz>[];
export type RelationsQuiz = { items: boolean } | { items: { options: boolean } };

export const QUIZ_REPOSITORY_TOKEN = 'QuizRepositoryToken';

export interface IQuizRepository {
  create(data: CreateQuiz): Promise<IQuiz>;
  find(filters?: FilterQuiz, relations?: RelationsQuiz): Promise<{ quizzes: IQuiz[]; total: number }>;
  findOne(filters: FilterQuiz, relations?: RelationsQuiz): Promise<IQuiz | null>;
  update(filters: FilterQuiz, data: UpdateQuiz): Promise<IQuiz | null>;
  delete(filters: FilterQuiz): Promise<boolean>;
}
