import { Test } from '@nestjs/testing';

import { TaskErrorCodes, Exception } from '@application/errors';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';
import { TASK_REPOSITORY_TOKEN } from '@domain/repositories/task/task.repository';

import { UpdateTaskUseCase } from '../update-task.use-case';

describe('Use Cases -> Task -> Update', () => {
  let updateTaskUseCase: UpdateTaskUseCase;

  const task = new TaskMock();

  const taskRepositoryMock = {
    findOne: jest.fn(),
    update: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UpdateTaskUseCase,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: taskRepositoryMock
        }
      ]
    }).compile();

    updateTaskUseCase = module.get<UpdateTaskUseCase>(UpdateTaskUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should update task', async () => {
    taskRepositoryMock.findOne.mockResolvedValue(task);
    taskRepositoryMock.update.mockResolvedValue(task);

    const input = {
      filters: { id: task.id },
      data: {
        name: 'Updated Name',
        description: 'Updated Description'
      }
    };

    const result = await updateTaskUseCase.execute(input);

    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
    expect(result).toEqual(task);
  });

  it('should not update - task not found', async () => {
    taskRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: task.id },
      data: { name: 'Updated Name' }
    };

    await expect(updateTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.NOT_FOUND));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - update failed', async () => {
    taskRepositoryMock.findOne.mockResolvedValue(task);
    taskRepositoryMock.update.mockResolvedValue(null);

    const input = {
      filters: { id: task.id },
      data: { name: 'Updated Name' }
    };

    await expect(updateTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.NOT_UPDATED));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.update).toHaveBeenCalledWith(input.filters, input.data);
  });

  it('should not update - invalid date range (both dates provided)', async () => {
    const existingTask = new TaskMock({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-10')
    });

    taskRepositoryMock.findOne.mockResolvedValue(existingTask);

    const input = {
      filters: { id: task.id },
      data: {
        startDate: new Date('2024-01-20'),
        endDate: new Date('2024-01-15')
      }
    };

    await expect(updateTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.INVALID_DATE_RANGE));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - invalid date range (only startDate provided)', async () => {
    const existingTask = new TaskMock({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-10')
    });

    taskRepositoryMock.findOne.mockResolvedValue(existingTask);

    const input = {
      filters: { id: task.id },
      data: {
        startDate: new Date('2024-01-15')
      }
    };

    await expect(updateTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.INVALID_DATE_RANGE));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - invalid date range (only endDate provided)', async () => {
    const existingTask = new TaskMock({
      startDate: new Date('2024-01-10'),
      endDate: new Date('2024-01-20')
    });

    taskRepositoryMock.findOne.mockResolvedValue(existingTask);

    const input = {
      filters: { id: task.id },
      data: {
        endDate: new Date('2024-01-05')
      }
    };

    await expect(updateTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.INVALID_DATE_RANGE));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.update).not.toHaveBeenCalled();
  });

  it('should not update - invalid date range (equal dates)', async () => {
    const existingTask = new TaskMock({
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-10')
    });

    taskRepositoryMock.findOne.mockResolvedValue(existingTask);

    const sameDate = new Date('2024-01-15');
    const input = {
      filters: { id: task.id },
      data: {
        startDate: sameDate,
        endDate: sameDate
      }
    };

    await expect(updateTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.INVALID_DATE_RANGE));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters);
    expect(taskRepositoryMock.update).not.toHaveBeenCalled();
  });
});
