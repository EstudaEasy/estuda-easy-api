import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WhiteboardModel } from '@database/typeorm/models/whiteboard/whiteboard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';

import { WhiteboardRepository } from '../whiteboard.repository';

describe('TypeOrm -> Whiteboard Repository -> Update', () => {
  const whiteboardMock = new WhiteboardMock();

  let whiteboardRepository: WhiteboardRepository;
  let whiteboardRepositoryMock: Repository<WhiteboardModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WhiteboardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(WhiteboardModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    whiteboardRepository = module.get<WhiteboardRepository>(WhiteboardRepository);
    whiteboardRepositoryMock = module.get<Repository<WhiteboardModel>>(getRepositoryToken(WhiteboardModel));

    updateSpy = jest.spyOn(whiteboardRepositoryMock, 'update');
    updateSpy.mockResolvedValue({ affected: 1, raw: [], generatedMaps: [] });

    findOneSpy = jest.spyOn(whiteboardRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(whiteboardMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return the whiteboard', async () => {
    const res = await whiteboardRepository.update({ id: whiteboardMock.id }, { title: 'Updated Title' });

    expect(res).toStrictEqual(whiteboardMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null if whiteboard not found', async () => {
    updateSpy.mockResolvedValueOnce({ affected: 0, raw: [], generatedMaps: [] });

    const res = await whiteboardRepository.update({ id: 'non-existent' }, { title: 'Updated Title' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
