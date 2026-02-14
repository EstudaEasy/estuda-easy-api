import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { WhiteboardModel } from '@database/typeorm/models/whiteboard/whiteboard.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';

import { WhiteboardRepository } from '../whiteboard.repository';

describe('TypeOrm -> Whiteboard Repository -> Delete', () => {
  const whiteboardMock = new WhiteboardMock();

  let whiteboardRepository: WhiteboardRepository;
  let whiteboardRepositoryMock: Repository<WhiteboardModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        WhiteboardRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(WhiteboardModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    whiteboardRepository = module.get<WhiteboardRepository>(WhiteboardRepository);
    whiteboardRepositoryMock = module.get<Repository<WhiteboardModel>>(getRepositoryToken(WhiteboardModel));

    deleteSpy = jest.spyOn(whiteboardRepositoryMock, 'delete');
    deleteSpy.mockResolvedValue({ affected: 1, raw: [] });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete and return true', async () => {
    const res = await whiteboardRepository.delete({ id: whiteboardMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false if whiteboard not found', async () => {
    deleteSpy.mockResolvedValueOnce({ affected: 0, raw: [] });

    const res = await whiteboardRepository.delete({ id: 'non-existent' });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
