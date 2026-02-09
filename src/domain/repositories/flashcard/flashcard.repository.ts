import { IFlashcard } from '@domain/entities/flashcard/flashcard.interface';
import { DomainFilter } from '@shared/types';

export type CreateFlashcard = Omit<IFlashcard, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateFlashcard = Partial<Omit<IFlashcard, 'id' | 'createdAt' | 'updatedAt'>>;
export type FilterFlashcard = DomainFilter<IFlashcard> | DomainFilter<IFlashcard>[];

export const FLASHCARD_REPOSITORY_TOKEN = 'FlashcardRepositoryToken';

export interface IFlashcardRepository {
  create(data: CreateFlashcard): Promise<IFlashcard>;
  find(filters?: FilterFlashcard): Promise<{ flashcards: IFlashcard[]; total: number }>;
  findOne(filters: FilterFlashcard): Promise<IFlashcard | null>;
  update(filters: FilterFlashcard, data: UpdateFlashcard): Promise<IFlashcard | null>;
  delete(filters: FilterFlashcard): Promise<boolean>;
}
