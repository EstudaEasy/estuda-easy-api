import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateGroupPost,
  FilterGroupPost,
  GROUP_POST_REPOSITORY_TOKEN,
  IGroupPostRepository,
  RelationsGroupPost,
  OrderGroupPost,
  UpdateGroupPost
} from '@domain/group-post/group-post.repository';

import { GroupPostModel } from '../../models/group-post/group-post.model';

@Injectable()
export class GroupPostRepository implements IGroupPostRepository {
  constructor(
    @InjectRepository(GroupPostModel)
    private readonly repository: Repository<GroupPostModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateGroupPost): Promise<GroupPostModel> {
    const post = this.repository.create(data);
    return await this.repository.save(post);
  }

  async find(
    filters?: FilterGroupPost,
    relations?: RelationsGroupPost,
    order?: OrderGroupPost
  ): Promise<{ posts: GroupPostModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [posts, total] = await this.repository.findAndCount({ where, relations, order });
    return { posts, total };
  }

  async findOne(filters: FilterGroupPost, relations?: RelationsGroupPost): Promise<GroupPostModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterGroupPost, data: UpdateGroupPost): Promise<GroupPostModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterGroupPost): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([GroupPostModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: GROUP_POST_REPOSITORY_TOKEN,
      useClass: GroupPostRepository
    }
  ],
  exports: [GROUP_POST_REPOSITORY_TOKEN]
})
export class GroupPostRepositoryModule {}
