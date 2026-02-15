import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WhiteboardModel } from '@database/typeorm/models/whiteboard/whiteboard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';

import { WhiteboardRepository } from '../whiteboard.repository';

describe('TypeOrm -> Whiteboard Repository -> Find', () => {
  const whiteboardsMock = WhiteboardMock.getList(2);

  let whiteboardRepository: WhiteboardRepository;
  let whiteboardRepositoryMock: Repository<WhiteboardModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WhiteboardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(WhiteboardModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    whiteboardRepository = module.get<WhiteboardRepository>(WhiteboardRepository);
    whiteboardRepositoryMock = module.get<Repository<WhiteboardModel>>(getRepositoryToken(WhiteboardModel));

    findAndCountSpy = jest.spyOn(whiteboardRepositoryMock, 'findAndCount');
    findAndCountSpy.mockResolvedValue([whiteboardsMock, whiteboardsMock.length]);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return whiteboards with total count', async () => {
    const res = await whiteboardRepository.find();

    expect(res).toStrictEqual({ whiteboards: whiteboardsMock, total: whiteboardsMock.length });
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
