import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateResourceFavorite,
  FilterResourceFavorite,
  IResourceFavoriteRepository,
  RelationsResourceFavorite,
  RESOURCE_FAVORITE_REPOSITORY_TOKEN,
  UpdateResourceFavorite
} from '@domain/resource-favorite/resource-favorite.repository';

import { ResourceFavoriteModel } from '../../models/resource-favorite/resource-favorite.model';

@Injectable()
export class ResourceFavoriteRepository implements IResourceFavoriteRepository {
  constructor(
    @InjectRepository(ResourceFavoriteModel)
    private readonly repository: Repository<ResourceFavoriteModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateResourceFavorite): Promise<ResourceFavoriteModel> {
    const favorite = this.repository.create(data);
    return await this.repository.save(favorite);
  }

  async find(
    filters?: FilterResourceFavorite,
    relations?: RelationsResourceFavorite
  ): Promise<{ favorites: ResourceFavoriteModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [favorites, total] = await this.repository.findAndCount({ where, relations });
    return { favorites, total };
  }

  async findOne(
    filters: FilterResourceFavorite,
    relations?: RelationsResourceFavorite
  ): Promise<ResourceFavoriteModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterResourceFavorite, data: UpdateResourceFavorite): Promise<ResourceFavoriteModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterResourceFavorite): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([ResourceFavoriteModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: RESOURCE_FAVORITE_REPOSITORY_TOKEN,
      useClass: ResourceFavoriteRepository
    }
  ],
  exports: [RESOURCE_FAVORITE_REPOSITORY_TOKEN]
})
export class ResourceFavoriteRepositoryModule {}
