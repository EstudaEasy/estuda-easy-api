import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateDiary,
  DIARY_REPOSITORY_TOKEN,
  FilterDiary,
  IDiaryRepository,
  RelationsDiary,
  UpdateDiary
} from '@domain/diary/diary.repository';

import { DiaryModel } from '../../models/diary/diary.model';

@Injectable()
export class DiaryRepository implements IDiaryRepository {
  constructor(
    @InjectRepository(DiaryModel)
    private readonly repository: Repository<DiaryModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateDiary): Promise<DiaryModel> {
    const diary = this.repository.create(data);
    return await this.repository.save(diary);
  }

  async find(filters?: FilterDiary, relations?: RelationsDiary): Promise<{ diaries: DiaryModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [diaries, total] = await this.repository.findAndCount({ where, relations });
    return { diaries, total };
  }

  async findOne(filters: FilterDiary, relations?: RelationsDiary): Promise<DiaryModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterDiary, data: UpdateDiary): Promise<DiaryModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterDiary): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([DiaryModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: DIARY_REPOSITORY_TOKEN,
      useClass: DiaryRepository
    }
  ],
  exports: [DIARY_REPOSITORY_TOKEN]
})
export class DiaryRepositoryModule {}
