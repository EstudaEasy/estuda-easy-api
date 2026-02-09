import { IDeck } from '@domain/entities/deck/deck.interface';
import { DomainFilter } from '@shared/types';

export type CreateDeck = Omit<IDeck, 'id' | 'flashcards' | 'resourceId' | 'createdAt' | 'updatedAt'>;
export type UpdateDeck = Partial<Omit<CreateDeck, 'resource'>>;
export type FilterDeck = DomainFilter<IDeck> | DomainFilter<IDeck>[];
export type RelationsDeck = { flashcards?: boolean; resource?: boolean };

export const DECK_REPOSITORY_TOKEN = 'DeckRepositoryToken';

export interface IDeckRepository {
  create(data: CreateDeck): Promise<IDeck>;
  find(filters?: FilterDeck, relations?: RelationsDeck): Promise<{ decks: IDeck[]; total: number }>;
  findOne(filters: FilterDeck, relations?: RelationsDeck): Promise<IDeck | null>;
  update(filters: FilterDeck, data: UpdateDeck): Promise<IDeck | null>;
  delete(filters: FilterDeck): Promise<boolean>;
}
