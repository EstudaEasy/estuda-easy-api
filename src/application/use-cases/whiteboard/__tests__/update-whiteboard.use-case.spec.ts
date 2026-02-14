import { Test } from '@nestjs/testing';

import { Exception, WhiteboardErrorCodes } from '@application/errors';
import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';
import { WHITEBOARD_REPOSITORY_TOKEN } from '@domain/repositories/whiteboard/whiteboard.repository';

import { UpdateWhiteboardUseCase } from '../update-whiteboard.use-case';

describe('Use Cases -> Whiteboard -> Update', () => {
  let updateWhiteboardUseCase: UpdateWhiteboardUseCase;

  const whiteboard = new WhiteboardMock();

  const whiteboardRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateWhiteboardUseCase,
        {
          provide: WHITEBOARD_REPOSITORY_TOKEN,
          useValue: whiteboardRepositoryMock
        }
      ]
    }).compile();

    updateWhiteboardUseCase = module.get<UpdateWhiteboardUseCase>(UpdateWhiteboardUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update whiteboard', async () => {
    whiteboardRepositoryMock.findOne.mockResolvedValue(whiteboard);
    whiteboardRepositoryMock.update.mockResolvedValue(whiteboard);

    const input = {
      filters: { id: whiteboard.id },
      data: {
        title: 'Updated Title',
        content: { shapes: [{ id: 1, updated: true }] }
      }
    };

    const result = await updateWhiteboardUseCase.execute(input);

    expect(whiteboardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(whiteboardRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(whiteboard);
  });

  it('should not update - whiteboard not found', async () => {
    whiteboardRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: whiteboard.id },
      data: { title: 'Updated Title' }
    };

    await expect(updateWhiteboardUseCase.execute(input)).rejects.toThrow(new Exception(WhiteboardErrorCodes.NOT_FOUND));
    expect(whiteboardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(whiteboardRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - update failed', async () => {
    whiteboardRepositoryMock.findOne.mockResolvedValue(whiteboard);
    whiteboardRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: whiteboard.id },
      data: { title: 'Updated Title' }
    };

    await expect(updateWhiteboardUseCase.execute(input)).rejects.toThrow(
      new Exception(WhiteboardErrorCodes.NOT_UPDATED)
    );
    expect(whiteboardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(whiteboardRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
  });
});
