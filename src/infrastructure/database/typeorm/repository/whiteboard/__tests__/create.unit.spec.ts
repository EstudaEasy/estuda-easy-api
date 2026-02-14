import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WhiteboardModel } from '@database/typeorm/models/whiteboard/whiteboard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';

import { WhiteboardRepository } from '../whiteboard.repository';

describe('TypeOrm -> Whiteboard Repository -> Create', () => {
  const whiteboardMock = new WhiteboardMock();

  let whiteboardRepository: WhiteboardRepository;
  let whiteboardRepositoryMock: Repository<WhiteboardModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WhiteboardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(WhiteboardModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    whiteboardRepository = module.get<WhiteboardRepository>(WhiteboardRepository);
    whiteboardRepositoryMock = module.get<Repository<WhiteboardModel>>(getRepositoryToken(WhiteboardModel));

    createSpy = jest.spyOn(whiteboardRepositoryMock, 'create');
    createSpy.mockReturnValue(whiteboardMock);

    saveSpy = jest.spyOn(whiteboardRepositoryMock, 'save');
    saveSpy.mockResolvedValue(whiteboardMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a whiteboard', async () => {
    const res = await whiteboardRepository.create({
      title: whiteboardMock.title,
      content: whiteboardMock.content
    });

    expect(res).toStrictEqual(whiteboardMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
