import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { GroupPostModel } from '@database/typeorm/models/group-post/group-post.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';

import { GroupPostRepository } from '../group-post.repository';

describe('TypeOrm -> GroupPost Repository -> Update', () => {
  const postMock = new GroupPostMock();

  let postRepository: GroupPostRepository;
  let postRepositoryMock: Repository<GroupPostModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupPostRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupPostModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    postRepository = module.get<GroupPostRepository>(GroupPostRepository);
    postRepositoryMock = module.get<Repository<GroupPostModel>>(getRepositoryToken(GroupPostModel));

    updateSpy = jest.spyOn(postRepositoryMock, 'update');
    findOneSpy = jest.spyOn(postRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a group post - post updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(postMock);

    const res = await postRepository.update({ id: postMock.id }, { content: 'Updated content' });

    expect(res).toStrictEqual(postMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - post not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await postRepository.update({ id: postMock.id }, { content: 'Updated content' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
