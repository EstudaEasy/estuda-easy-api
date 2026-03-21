import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { GroupPostModel } from '@database/typeorm/models/group-post/group-post.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { GroupPostMock } from '@domain/group-post/__mocks__/group-post.mock';

import { GroupPostRepository } from '../group-post.repository';

describe('TypeOrm -> GroupPost Repository -> Create', () => {
  const postMock = new GroupPostMock();

  let postRepository: GroupPostRepository;
  let postRepositoryMock: Repository<GroupPostModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        GroupPostRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(GroupPostModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    postRepository = module.get<GroupPostRepository>(GroupPostRepository);
    postRepositoryMock = module.get<Repository<GroupPostModel>>(getRepositoryToken(GroupPostModel));

    createSpy = jest.spyOn(postRepositoryMock, 'create');
    createSpy.mockReturnValue(postMock);

    saveSpy = jest.spyOn(postRepositoryMock, 'save');
    saveSpy.mockResolvedValue(postMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a group post', async () => {
    const res = await postRepository.create({
      content: postMock.content,
      groupId: postMock.groupId,
      authorId: postMock.authorId
    });

    expect(res).toStrictEqual(postMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
