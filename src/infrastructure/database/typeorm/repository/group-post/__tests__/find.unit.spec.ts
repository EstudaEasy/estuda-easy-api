import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupPostModel } from '@database/typeorm/models/group-post/group-post.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';

import { GroupPostRepository } from '../group-post.repository';

describe('TypeOrm -> GroupPost Repository -> Find', () => {
  const postMocks = GroupPostMock.getList(3);

  let postRepository: GroupPostRepository;
  let postRepositoryMock: Repository<GroupPostModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupPostRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupPostModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    postRepository = module.get<GroupPostRepository>(GroupPostRepository);
    postRepositoryMock = module.get<Repository<GroupPostModel>>(getRepositoryToken(GroupPostModel));

    findAndCountSpy = jest.spyOn(postRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return group posts with count', async () => {
    findAndCountSpy.mockResolvedValue([postMocks, postMocks.length]);

    const res = await postRepository.find();

    expect(res).toEqual({ posts: postMocks, total: 3 });
    expect(res.posts).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no group posts found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await postRepository.find();

    expect(res).toEqual({ posts: [], total: 0 });
    expect(res.posts).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
