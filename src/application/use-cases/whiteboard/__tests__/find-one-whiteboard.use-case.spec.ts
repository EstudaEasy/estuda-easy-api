import { Test } from '@nestjs/testing';

import { Exception, WhiteboardErrorCodes } from '@application/errors';
import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';
import { WHITEBOARD_REPOSITORY_TOKEN } from '@domain/repositories/whiteboard/whiteboard.repository';

import { FindOneWhiteboardUseCase } from '../find-one-whiteboard.use-case';

describe('Use Cases -> Whiteboard -> Find One', () => {
  let findOneWhiteboardUseCase: FindOneWhiteboardUseCase;

  const whiteboard = new WhiteboardMock();

  const whiteboardRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneWhiteboardUseCase,
        {
          provide: WHITEBOARD_REPOSITORY_TOKEN,
          useValue: whiteboardRepositoryMock
        }
      ]
    }).compile();

    findOneWhiteboardUseCase = module.get<FindOneWhiteboardUseCase>(FindOneWhiteboardUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one whiteboard', async () => {
    whiteboardRepositoryMock.findOne.mockResolvedValue(whiteboard);

    const input = {
      filters: { id: whiteboard.id },
      relations: { resource: true }
    };

    const result = await findOneWhiteboardUseCase.execute(input);

    expect(whiteboardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(whiteboard);
  });

  it('should not find whiteboard - whiteboard not found', async () => {
    whiteboardRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: whiteboard.id }
    };

    await expect(findOneWhiteboardUseCase.execute(input)).rejects.toThrow(
      new Exception(WhiteboardErrorCodes.NOT_FOUND)
    );
    expect(whiteboardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
