import { Test } from '@nestjs/testing';

import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';
import { WHITEBOARD_REPOSITORY_TOKEN } from '@domain/repositories/whiteboard/whiteboard.repository';

import { FindWhiteboardsUseCase } from '../find-whiteboards.use-case';

describe('Use Cases -> Whiteboard -> Find', () => {
  let findWhiteboardsUseCase: FindWhiteboardsUseCase;

  const whiteboards = WhiteboardMock.getList(2);
  const total = whiteboards.length;

  const whiteboardRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindWhiteboardsUseCase,
        {
          provide: WHITEBOARD_REPOSITORY_TOKEN,
          useValue: whiteboardRepositoryMock
        }
      ]
    }).compile();

    findWhiteboardsUseCase = module.get<FindWhiteboardsUseCase>(FindWhiteboardsUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find whiteboards', async () => {
    whiteboardRepositoryMock.find.mockResolvedValue({ whiteboards, total });

    const input = {
      filters: {},
      relations: { resource: true }
    };

    const result = await findWhiteboardsUseCase.execute(input);

    expect(whiteboardRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.whiteboards).toEqual(whiteboards);
    expect(result.total).toBe(total);
  });

  it('should find whiteboards with filters', async () => {
    const filteredWhiteboards = [whiteboards[0]];
    whiteboardRepositoryMock.find.mockResolvedValue({ whiteboards: filteredWhiteboards, total: 1 });

    const input = {
      filters: { title: whiteboards[0].title },
      relations: { resource: true }
    };

    const result = await findWhiteboardsUseCase.execute(input);

    expect(whiteboardRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.whiteboards).toEqual(filteredWhiteboards);
    expect(result.total).toBe(1);
  });
});
