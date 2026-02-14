import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateWhiteboard,
  FilterWhiteboard,
  IWhiteboardRepository,
  RelationsWhiteboard,
  UpdateWhiteboard,
  WHITEBOARD_REPOSITORY_TOKEN
} from '@domain/repositories/whiteboard/whiteboard.repository';

import { WhiteboardModel } from '../../models/whiteboard/whiteboard.model';

@Injectable()
export class WhiteboardRepository implements IWhiteboardRepository {
  constructor(
    @InjectRepository(WhiteboardModel)
    private readonly repository: Repository<WhiteboardModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateWhiteboard): Promise<WhiteboardModel> {
    const whiteboard = this.repository.create(data);
    return await this.repository.save(whiteboard);
  }

  async find(
    filters?: FilterWhiteboard,
    relations?: RelationsWhiteboard
  ): Promise<{ whiteboards: WhiteboardModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [whiteboards, total] = await this.repository.findAndCount({ where, relations });
    return { whiteboards, total };
  }

  async findOne(filters: FilterWhiteboard, relations?: RelationsWhiteboard): Promise<WhiteboardModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterWhiteboard, data: UpdateWhiteboard): Promise<WhiteboardModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterWhiteboard): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([WhiteboardModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: WHITEBOARD_REPOSITORY_TOKEN,
      useClass: WhiteboardRepository
    }
  ],
  exports: [WHITEBOARD_REPOSITORY_TOKEN]
})
export class WhiteboardRepositoryModule {}
