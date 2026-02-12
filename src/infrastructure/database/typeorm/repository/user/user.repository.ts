import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateUser,
  FilterUser,
  IUserRepository,
  UpdateUser,
  RelationsUser,
  USER_REPOSITORY_TOKEN
} from '@domain/repositories/user/user.repository';

import { UserModel } from '../../models/user/user.model';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateUser): Promise<UserModel> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async find(filters?: FilterUser, relations?: RelationsUser): Promise<{ users: UserModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [users, total] = await this.repository.findAndCount({ where, relations });
    return { users, total };
  }

  async findOne(filters: FilterUser, relations?: RelationsUser): Promise<UserModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterUser, data: UpdateUser): Promise<UserModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterUser): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository
    }
  ],
  exports: [USER_REPOSITORY_TOKEN]
})
export class UserRepositoryModule {}
