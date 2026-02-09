import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateDeck,
  DECK_REPOSITORY_TOKEN,
  FilterDeck,
  IDeckRepository,
  RelationsDeck,
  UpdateDeck
} from '@domain/repositories/deck/deck.repository';

import { DeckModel } from '../../models/deck/deck.model';

@Injectable()
export class DeckRepository implements IDeckRepository {
  constructor(
    @InjectRepository(DeckModel)
    private readonly repository: Repository<DeckModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateDeck): Promise<DeckModel> {
    const deck = this.repository.create(data);
    return await this.repository.save(deck);
  }

  async find(filters?: FilterDeck, relations?: RelationsDeck): Promise<{ decks: DeckModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [decks, total] = await this.repository.findAndCount({ where, relations });
    return { decks, total };
  }

  async findOne(filters: FilterDeck, relations?: RelationsDeck): Promise<DeckModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterDeck, data: UpdateDeck): Promise<DeckModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterDeck): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([DeckModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: DECK_REPOSITORY_TOKEN,
      useClass: DeckRepository
    }
  ],
  exports: [DECK_REPOSITORY_TOKEN]
})
export class DeckRepositoryModule {}
