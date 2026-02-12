import { Test } from '@nestjs/testing';

import { TaskErrorCodes, Exception } from '@application/errors';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';
import { TASK_REPOSITORY_TOKEN } from '@domain/repositories/task/task.repository';

import { DeleteTaskUseCase } from '../delete-task.use-case';

describe('Use Cases -> Task -> Delete', () => {
  let deleteTaskUseCase: DeleteTaskUseCase;

  const task = new TaskMock();

  const taskRepositoryMock = {
    findOne: jest.fn(),
    delete: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        DeleteTaskUseCase,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: taskRepositoryMock
        }
      ]
    }).compile();

    deleteTaskUseCase = module.get<DeleteTaskUseCase>(DeleteTaskUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should delete task', async () => {
    taskRepositoryMock.findOne.mockResolvedValue(task);
    taskRepositoryMock.delete.mockResolvedValue(true);

    const input = {
      filters: { id: task.id }
    };

    await expect(deleteTaskUseCase.execute(input)).resolves.toBeUndefined();

    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });

  it('should not delete - task not found', async () => {
    taskRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: task.id }
    };

    await expect(deleteTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.NOT_FOUND));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.delete).not.toHaveBeenCalled();
  });

  it('should not delete - failed to delete', async () => {
    taskRepositoryMock.findOne.mockResolvedValue(task);
    taskRepositoryMock.delete.mockResolvedValue(false);

    const input = {
      filters: { id: task.id }
    };

    await expect(deleteTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.NOT_DELETED));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.delete).toHaveBeenCalledWith(input.filters);
  });
});
