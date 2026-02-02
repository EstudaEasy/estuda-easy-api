import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateQuiz,
  FilterQuiz,
  IQuizRepository,
  QUIZ_REPOSITORY_TOKEN,
  RelationsQuiz,
  UpdateQuiz
} from '@domain/repositories/quiz/quiz.repository';

import { QuizModel } from '../../models/quiz/quiz.model';

@Injectable()
export class QuizRepository implements IQuizRepository {
  constructor(
    @InjectRepository(QuizModel)
    private readonly repository: Repository<QuizModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateQuiz): Promise<QuizModel> {
    const quiz = this.repository.create(data);
    return await this.repository.save(quiz);
  }

  async find(filters?: FilterQuiz, relations?: RelationsQuiz): Promise<{ quizzes: QuizModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [quizzes, total] = await this.repository.findAndCount({ where, relations });
    return { quizzes, total };
  }

  async findOne(filters: FilterQuiz, relations?: RelationsQuiz): Promise<QuizModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterQuiz, data: UpdateQuiz): Promise<QuizModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterQuiz): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([QuizModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: QUIZ_REPOSITORY_TOKEN,
      useClass: QuizRepository
    }
  ],
  exports: [QUIZ_REPOSITORY_TOKEN]
})
export class QuizRepositoryModule {}
