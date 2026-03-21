import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateResourceShareLink,
  FilterResourceShareLink,
  IResourceShareLinkRepository,
  RelationsResourceShareLink,
  RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
  UpdateResourceShareLink
} from '@domain/resource-share-link/resource-share-link.repository';

import { ResourceShareLinkModel } from '../../models/resource-share-link/resource-share-link.model';

@Injectable()
export class ResourceShareLinkRepository implements IResourceShareLinkRepository {
  constructor(
    @InjectRepository(ResourceShareLinkModel)
    private readonly repository: Repository<ResourceShareLinkModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateResourceShareLink): Promise<ResourceShareLinkModel> {
    const shareLink = this.repository.create(data);
    return await this.repository.save(shareLink);
  }

  async find(
    filters?: FilterResourceShareLink,
    relations?: RelationsResourceShareLink
  ): Promise<{ shareLinks: ResourceShareLinkModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [shareLinks, total] = await this.repository.findAndCount({ where, relations });
    return { shareLinks, total };
  }

  async findOne(
    filters: FilterResourceShareLink,
    relations?: RelationsResourceShareLink
  ): Promise<ResourceShareLinkModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(
    filters: FilterResourceShareLink,
    data: UpdateResourceShareLink
  ): Promise<ResourceShareLinkModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterResourceShareLink): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([ResourceShareLinkModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: RESOURCE_SHARE_LINK_REPOSITORY_TOKEN,
      useClass: ResourceShareLinkRepository
    }
  ],
  exports: [RESOURCE_SHARE_LINK_REPOSITORY_TOKEN]
})
export class ResourceShareLinkRepositoryModule {}
