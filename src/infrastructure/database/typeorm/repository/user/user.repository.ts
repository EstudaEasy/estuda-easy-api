import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';

import { RelationsUser } from '@domain/entities/user/user.interface';
import {
  CreateUser,
  IUserRepository,
  UpdateUser,
  USER_REPOSITORY_TOKEN
} from '@domain/repositories/user/user.repository';
import { UserModel } from '../../models/user/user.model';

type WhereUser = FindOptionsWhere<UserModel> | FindOptionsWhere<UserModel>[];

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    @InjectRepository(UserModel)
    private readonly repository: Repository<UserModel>
  ) {}

  async create(data: CreateUser): Promise<UserModel> {
    const user = this.repository.create(data);
    return await this.repository.save(user);
  }

  async find(where?: WhereUser, relations?: RelationsUser): Promise<{ users: UserModel[]; total: number }> {
    const [users, total] = await this.repository.findAndCount({ where, relations });
    return { users, total };
  }

  async findOne(where: WhereUser, relations?: RelationsUser): Promise<UserModel | null> {
    return await this.repository.findOne({ where, relations });
  }

  async update(where: WhereUser, data: UpdateUser): Promise<UserModel | null> {
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(where: WhereUser): Promise<boolean> {
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
    {
      provide: USER_REPOSITORY_TOKEN,
      useClass: UserRepository
    }
  ],
  exports: [USER_REPOSITORY_TOKEN]
})
export class UserRepositoryModule {}
