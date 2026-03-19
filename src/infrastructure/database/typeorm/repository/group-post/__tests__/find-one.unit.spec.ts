import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupPostModel } from '@database/typeorm/models/group-post/group-post.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';

import { GroupPostRepository } from '../group-post.repository';

describe('TypeOrm -> GroupPost Repository -> Find One', () => {
  const postMock = new GroupPostMock();

  let postRepository: GroupPostRepository;
  let postRepositoryMock: Repository<GroupPostModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupPostRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupPostModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    postRepository = module.get<GroupPostRepository>(GroupPostRepository);
    postRepositoryMock = module.get<Repository<GroupPostModel>>(getRepositoryToken(GroupPostModel));

    findOneSpy = jest.spyOn(postRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(postMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a group post - post found', async () => {
    const res = await postRepository.findOne({ id: postMock.id });

    expect(res).toStrictEqual(postMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - post not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await postRepository.findOne({ id: postMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
