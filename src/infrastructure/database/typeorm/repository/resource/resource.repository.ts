import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateResource,
  FilterResource,
  IResourceRepository,
  RelationsResource,
  RESOURCE_REPOSITORY_TOKEN,
  UpdateResource
} from '@domain/repositories/resource/resource.repository';

import { ResourceModel } from '../../models/resource/resource.model';

@Injectable()
export class ResourceRepository implements IResourceRepository {
  constructor(
    @InjectRepository(ResourceModel)
    private readonly repository: Repository<ResourceModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateResource): Promise<ResourceModel> {
    const resource = this.repository.create(data);
    return await this.repository.save(resource);
  }

  async find(
    filters?: FilterResource,
    relations?: RelationsResource
  ): Promise<{ resources: ResourceModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [resources, total] = await this.repository.findAndCount({ where, relations });
    return { resources, total };
  }

  async findOne(filters: FilterResource, relations?: RelationsResource): Promise<ResourceModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterResource, data: UpdateResource): Promise<ResourceModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterResource): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([ResourceModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: RESOURCE_REPOSITORY_TOKEN,
      useClass: ResourceRepository
    }
  ],
  exports: [RESOURCE_REPOSITORY_TOKEN]
})
export class ResourceRepositoryModule {}
