import { Test } from '@nestjs/testing';

import { Exception, WhiteboardErrorCodes } from '@application/errors';
import { WhiteboardMock } from '@domain/entities/whiteboard/__mocks__/whiteboard.mock';
import { WHITEBOARD_REPOSITORY_TOKEN } from '@domain/repositories/whiteboard/whiteboard.repository';

import { DeleteWhiteboardUseCase } from '../delete-whiteboard.use-case';

describe('Use Cases -> Whiteboard -> Delete', () => {
  let deleteWhiteboardUseCase: DeleteWhiteboardUseCase;

  const whiteboard = new WhiteboardMock();

  const whiteboardRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteWhiteboardUseCase,
        {
          provide: WHITEBOARD_REPOSITORY_TOKEN,
          useValue: whiteboardRepositoryMock
        }
      ]
    }).compile();

    deleteWhiteboardUseCase = module.get<DeleteWhiteboardUseCase>(DeleteWhiteboardUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete whiteboard', async () => {
    whiteboardRepositoryMock.findOne.mockResolvedValue(whiteboard);
    whiteboardRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: whiteboard.id }
    };

    await expect(deleteWhiteboardUseCase.execute(input)).resolves.toBeUndefined();

    expect(whiteboardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(whiteboardRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should not delete - whiteboard not found', async () => {
    whiteboardRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: whiteboard.id }
    };

    await expect(deleteWhiteboardUseCase.execute(input)).rejects.toThrow(new Exception(WhiteboardErrorCodes.NOT_FOUND));
    expect(whiteboardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(whiteboardRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - failed to delete', async () => {
    whiteboardRepositoryMock.findOne.mockResolvedValue(whiteboard);
    whiteboardRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: whiteboard.id }
    };

    await expect(deleteWhiteboardUseCase.execute(input)).rejects.toThrow(
      new Exception(WhiteboardErrorCodes.NOT_DELETED)
    );
    expect(whiteboardRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(whiteboardRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });
});
