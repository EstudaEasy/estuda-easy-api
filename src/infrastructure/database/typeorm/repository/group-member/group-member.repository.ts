import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateGroupMember,
  FilterGroupMember,
  GROUP_MEMBER_REPOSITORY_TOKEN,
  IGroupMemberRepository,
  RelationsGroupMember,
  UpdateGroupMember
} from '@domain/repositories/group-member/group-member.repository';

import { GroupMemberModel } from '../../models/group-member/group-member.model';

@Injectable()
export class GroupMemberRepository implements IGroupMemberRepository {
  constructor(
    @InjectRepository(GroupMemberModel)
    private readonly repository: Repository<GroupMemberModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateGroupMember): Promise<GroupMemberModel> {
    const member = this.repository.create(data);
    return await this.repository.save(member);
  }

  async find(
    filters?: FilterGroupMember,
    relations?: RelationsGroupMember
  ): Promise<{ members: GroupMemberModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [members, total] = await this.repository.findAndCount({ where, relations });
    return { members, total };
  }

  async findOne(filters: FilterGroupMember, relations?: RelationsGroupMember): Promise<GroupMemberModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterGroupMember, data: UpdateGroupMember): Promise<GroupMemberModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterGroupMember): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([GroupMemberModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: GROUP_MEMBER_REPOSITORY_TOKEN,
      useClass: GroupMemberRepository
    }
  ],
  exports: [GROUP_MEMBER_REPOSITORY_TOKEN]
})
export class GroupMemberRepositoryModule {}
