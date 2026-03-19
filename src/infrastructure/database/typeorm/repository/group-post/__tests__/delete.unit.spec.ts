import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { GroupPostModel } from '@database/typeorm/models/group-post/group-post.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';

import { GroupPostRepository } from '../group-post.repository';

describe('TypeOrm -> GroupPost Repository -> Delete', () => {
  const postMock = new GroupPostMock();

  let postRepository: GroupPostRepository;
  let postRepositoryMock: Repository<GroupPostModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupPostRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupPostModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    postRepository = module.get<GroupPostRepository>(GroupPostRepository);
    postRepositoryMock = module.get<Repository<GroupPostModel>>(getRepositoryToken(GroupPostModel));

    deleteSpy = jest.spyOn(postRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a group post and return true - post found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await postRepository.delete({ id: postMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - post not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await postRepository.delete({ id: postMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
