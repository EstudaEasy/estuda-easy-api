import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateQuizItem,
  FilterQuizItem,
  IQuizItemRepository,
  QUIZ_ITEM_REPOSITORY_TOKEN,
  RelationsQuizItem,
  UpdateQuizItem
} from '@domain/repositories/quiz-item/quiz-item.repository';

import { QuizItemModel } from '../../models/quiz-item/quiz-item.model';
import { QuizOptionModel } from '../../models/quiz-option/quiz-option.model';

@Injectable()
export class QuizItemRepository implements IQuizItemRepository {
  constructor(
    @InjectRepository(QuizItemModel)
    private readonly itemRepository: Repository<QuizItemModel>,
    @InjectRepository(QuizOptionModel)
    private readonly optionRepository: Repository<QuizOptionModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateQuizItem): Promise<QuizItemModel> {
    const { options, ...quizItemData } = data;
    const quizItem = this.itemRepository.create(quizItemData);

    if (options && options.length > 0) {
      quizItem.options = this.optionRepository.create(options);
    }

    return await this.itemRepository.save(quizItem);
  }

  async find(
    filters?: FilterQuizItem,
    relations?: RelationsQuizItem
  ): Promise<{ quizItems: QuizItemModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [quizItems, total] = await this.itemRepository.findAndCount({ where, relations });
    return { quizItems, total };
  }

  async findOne(filters: FilterQuizItem, relations?: RelationsQuizItem): Promise<QuizItemModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.itemRepository.findOne({ where, relations });
  }

  async update(filters: FilterQuizItem, data: UpdateQuizItem): Promise<QuizItemModel | null> {
    const { options, ...quizItemData } = data;
    const where = this.typeOrmUtilsService.buildWhere(filters);

    const existingQuizItem = await this.itemRepository.findOne({ where, relations: { options: true } });
    if (!existingQuizItem) {
      return null;
    }

    const updatedQuizItem = this.itemRepository.create({ ...existingQuizItem, ...quizItemData });
    if (options) {
      updatedQuizItem.options = this.optionRepository.create(options);
    }

    return await this.itemRepository.save(updatedQuizItem);
  }

  async delete(filters: FilterQuizItem): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.itemRepository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([QuizItemModel, QuizOptionModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: QUIZ_ITEM_REPOSITORY_TOKEN,
      useClass: QuizItemRepository
    }
  ],
  exports: [QUIZ_ITEM_REPOSITORY_TOKEN]
})
export class QuizItemRepositoryModule {}
