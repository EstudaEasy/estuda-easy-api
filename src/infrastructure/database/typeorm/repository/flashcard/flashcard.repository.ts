import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateFlashcard,
  FilterFlashcard,
  FLASHCARD_REPOSITORY_TOKEN,
  IFlashcardRepository,
  UpdateFlashcard
} from '@domain/repositories/flashcard/flashcard.repository';

import { FlashcardModel } from '../../models/flashcard/flashcard.model';

@Injectable()
export class FlashcardRepository implements IFlashcardRepository {
  constructor(
    @InjectRepository(FlashcardModel)
    private readonly repository: Repository<FlashcardModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateFlashcard): Promise<FlashcardModel> {
    const flashcard = this.repository.create(data);
    return await this.repository.save(flashcard);
  }

  async find(filters?: FilterFlashcard): Promise<{ flashcards: FlashcardModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [flashcards, total] = await this.repository.findAndCount({ where });
    return { flashcards, total };
  }

  async findOne(filters: FilterFlashcard): Promise<FlashcardModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where });
  }

  async update(filters: FilterFlashcard, data: UpdateFlashcard): Promise<FlashcardModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterFlashcard): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([FlashcardModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: FLASHCARD_REPOSITORY_TOKEN,
      useClass: FlashcardRepository
    }
  ],
  exports: [FLASHCARD_REPOSITORY_TOKEN]
})
export class FlashcardRepositoryModule {}
