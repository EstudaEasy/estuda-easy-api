import { IQuizItem } from '@domain/entities/quiz-item/quiz-item.interface';
import { IQuizOption } from '@domain/entities/quiz-option/quiz-option.interface';
import { DomainFilter } from '@shared/types';

export type CreateQuizOptions = Omit<IQuizOption, 'id' | 'quizItemId'>;
export type UpdateQuizOptions = CreateQuizOptions & { id?: number };

export type CreateQuizItem = Omit<IQuizItem, 'id' | 'options' | 'createdAt' | 'updatedAt'> & {
  options: CreateQuizOptions[];
};
export type UpdateQuizItem = Partial<Omit<IQuizItem, 'id' | 'options' | 'createdAt' | 'updatedAt'>> & {
  options?: UpdateQuizOptions[];
};
export type FilterQuizItem = DomainFilter<IQuizItem> | DomainFilter<IQuizItem>[];
export type RelationsQuizItem = { options: boolean };

export const QUIZ_ITEM_REPOSITORY_TOKEN = 'QuizItemRepositoryToken';

export interface IQuizItemRepository {
  create(data: CreateQuizItem): Promise<IQuizItem>;
  find(filters?: FilterQuizItem, relations?: RelationsQuizItem): Promise<{ quizItems: IQuizItem[]; total: number }>;
  findOne(filters: FilterQuizItem, relations?: RelationsQuizItem): Promise<IQuizItem | null>;
  update(filters: FilterQuizItem, data: UpdateQuizItem): Promise<IQuizItem | null>;
  delete(filters: FilterQuizItem): Promise<boolean>;
}
