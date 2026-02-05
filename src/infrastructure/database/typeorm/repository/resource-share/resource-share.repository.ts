import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateResourceShare,
  FilterResourceShare,
  IResourceShareRepository,
  RelationsResourceShare,
  RESOURCE_SHARE_REPOSITORY_TOKEN,
  UpdateResourceShare
} from '@domain/repositories/resource-share/resource-share.repository';

import { ResourceShareModel } from '../../models/resource-share/resource-share.model';

@Injectable()
export class ResourceShareRepository implements IResourceShareRepository {
  constructor(
    @InjectRepository(ResourceShareModel)
    private readonly repository: Repository<ResourceShareModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateResourceShare): Promise<ResourceShareModel> {
    const share = this.repository.create(data);
    return await this.repository.save(share);
  }

  async find(
    filters?: FilterResourceShare,
    relations?: RelationsResourceShare
  ): Promise<{ shares: ResourceShareModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [shares, total] = await this.repository.findAndCount({ where, relations });
    return { shares, total };
  }

  async findOne(filters: FilterResourceShare, relations?: RelationsResourceShare): Promise<ResourceShareModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterResourceShare, data: UpdateResourceShare): Promise<ResourceShareModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterResourceShare): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([ResourceShareModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: RESOURCE_SHARE_REPOSITORY_TOKEN,
      useClass: ResourceShareRepository
    }
  ],
  exports: [RESOURCE_SHARE_REPOSITORY_TOKEN]
})
export class ResourceShareRepositoryModule {}
