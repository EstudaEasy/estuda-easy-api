import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import {
  CreateUserSession,
  IUserSessionRepository,
  RelationsUserSession,
  UpdateUserSession,
  USER_SESSION_REPOSITORY_TOKEN,
  FilterUserSession
} from '@domain/repositories/user-session/user-session.repository';

import { UserSessionModel } from '../../models/user-session/user-session.model';

@Injectable()
export class UserSessionRepository implements IUserSessionRepository {
  constructor(
    @InjectRepository(UserSessionModel)
    private readonly repository: Repository<UserSessionModel>,
    private readonly typeOrmUtilsService: TypeOrmUtilsService
  ) {}

  async create(data: CreateUserSession): Promise<UserSessionModel> {
    const session = this.repository.create(data);
    return await this.repository.save(session);
  }

  async find(
    filters?: FilterUserSession,
    relations?: RelationsUserSession
  ): Promise<{ sessions: UserSessionModel[]; total: number }> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const [sessions, total] = await this.repository.findAndCount({ where, relations });
    return { sessions, total };
  }

  async findOne(filters: FilterUserSession, relations?: RelationsUserSession): Promise<UserSessionModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    return await this.repository.findOne({ where, relations });
  }

  async update(filters: FilterUserSession, data: UpdateUserSession): Promise<UserSessionModel | null> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(filters: FilterUserSession): Promise<boolean> {
    const where = this.typeOrmUtilsService.buildWhere(filters);
    const res = await this.repository.delete(where);
    if (res.affected && res.affected > 0) {
      return true;
    }
    return false;
  }
}

@Module({
  imports: [TypeOrmModule.forFeature([UserSessionModel])],
  providers: [
    TypeOrmUtilsService,
    {
      provide: USER_SESSION_REPOSITORY_TOKEN,
      useClass: UserSessionRepository
    }
  ],
  exports: [USER_SESSION_REPOSITORY_TOKEN]
})
export class UserSessionRepositoryModule {}
