import { Injectable, Module } from '@nestjs/common';
import { InjectRepository, TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  CreateUserSession,
  IUserSessionRepository,
  RelationsUserSession,
  UpdateUserSession,
  UserSessionRepositoryToken,
  WhereUserSession
} from '@domain/repositories/user-session/user-session.repository';

import { UserSessionModel } from '../../models/user-session/user-session.model';

@Injectable()
export class UserSessionRepository implements IUserSessionRepository {
  constructor(
    @InjectRepository(UserSessionModel)
    private readonly repository: Repository<UserSessionModel>
  ) {}

  async create(data: CreateUserSession): Promise<UserSessionModel> {
    const session = this.repository.create(data);
    return await this.repository.save(session);
  }

  async find(
    where?: WhereUserSession,
    relations?: RelationsUserSession
  ): Promise<{ sessions: UserSessionModel[]; total: number }> {
    const [sessions, total] = await this.repository.findAndCount({ where, relations });
    return { sessions, total };
  }

  async findOne(where: WhereUserSession, relations?: RelationsUserSession): Promise<UserSessionModel | null> {
    return await this.repository.findOne({ where, relations });
  }

  async update(where: WhereUserSession, data: UpdateUserSession): Promise<UserSessionModel | null> {
    const res = await this.repository.update(where, data);
    if (res.affected && res.affected > 0) {
      return this.repository.findOne({ where });
    }
    return null;
  }

  async delete(where: WhereUserSession): Promise<boolean> {
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
    {
      provide: UserSessionRepositoryToken,
      useClass: UserSessionRepository
    }
  ],
  exports: [UserSessionRepositoryToken]
})
export class UserSessionRepositoryModule {}
