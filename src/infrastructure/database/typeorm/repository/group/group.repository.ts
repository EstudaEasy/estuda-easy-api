import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateGroup,
  FilterGroup,
  GROUP_REPOSITORY_TOKEN,
  IGroupRepository,
  RelationsGroup,
  UpdateGroup
} from '@domain/repositories/group/group.repository';

import { GroupModel } from '../../models/group/group.model';

@Injectable()
export class GroupRepository implements IGroupRepository {
  constructor(
    @InjectRepository(GroupModel)
    private readonly repository: Repository<GroupModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateGroup): Promise<GroupModel> {
    const group = this.repository.create(data);
    return await this.repository.save(group);
  }

  async find(filters?: FilterGroup, relations?: RelationsGroup): Promise<{ groups: GroupModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [groups, total] = await this.repository.findAndCount({ where, relations });
    return { groups, total };
  }

  async findOne(filters: FilterGroup, relations?: RelationsGroup): Promise<GroupModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterGroup, data: UpdateGroup): Promise<GroupModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterGroup): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([GroupModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: GROUP_REPOSITORY_TOKEN,
      useClass: GroupRepository
    }
  ],
  exports: [GROUP_REPOSITORY_TOKEN]
})
export class GroupRepositoryModule {}
