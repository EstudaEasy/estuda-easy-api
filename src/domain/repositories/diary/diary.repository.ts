import { IDiary } from '@domain/entities/diary/diary.interface';
import { DomainFilter } from '@shared/types';

export type CreateDiary = Omit<IDiary, 'id' | 'resourceId' | 'createdAt' | 'updatedAt'>;
export type UpdateDiary = Partial<Omit<CreateDiary, 'resource'>>;
export type FilterDiary = DomainFilter<IDiary> | DomainFilter<IDiary>[];
export type RelationsDiary = { resource?: boolean };

export const DIARY_REPOSITORY_TOKEN = 'DiaryRepositoryToken';

export interface IDiaryRepository {
  create(data: CreateDiary): Promise<IDiary>;
  find(filters?: FilterDiary, relations?: RelationsDiary): Promise<{ diaries: IDiary[]; total: number }>;
  findOne(filters: FilterDiary, relations?: RelationsDiary): Promise<IDiary | null>;
  update(filters: FilterDiary, data: UpdateDiary): Promise<IDiary | null>;
  delete(filters: FilterDiary): Promise<boolean>;
}
