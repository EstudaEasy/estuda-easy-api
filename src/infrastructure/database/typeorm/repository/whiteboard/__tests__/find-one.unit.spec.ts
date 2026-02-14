import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WhiteboardModel } from '@database/typeorm/models/whiteboard/whiteboard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';

import { WhiteboardRepository } from '../whiteboard.repository';

describe('TypeOrm -> Whiteboard Repository -> FindOne', () => {
  const whiteboardMock = new WhiteboardMock();

  let whiteboardRepository: WhiteboardRepository;
  let whiteboardRepositoryMock: Repository<WhiteboardModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WhiteboardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(WhiteboardModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    whiteboardRepository = module.get<WhiteboardRepository>(WhiteboardRepository);
    whiteboardRepositoryMock = module.get<Repository<WhiteboardModel>>(getRepositoryToken(WhiteboardModel));

    findOneSpy = jest.spyOn(whiteboardRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(whiteboardMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return one whiteboard', async () => {
    const res = await whiteboardRepository.findOne({ id: whiteboardMock.id });

    expect(res).toStrictEqual(whiteboardMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
