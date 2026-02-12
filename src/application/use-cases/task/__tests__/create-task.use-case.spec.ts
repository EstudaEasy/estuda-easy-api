import { Test } from '@nestjs/testing';

import { TaskErrorCodes, Exception } from '@application/errors';
import { ResourceMock } from '@domain/entities/resource/__mocks__/resource.mock';
import { ResourceType } from '@domain/entities/resource/resource.interface';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';
import { UserMock } from '@domain/entities/user/__mocks__/user.mock';
import { RESOURCE_REPOSITORY_TOKEN } from '@domain/repositories/resource/resource.repository';
import { TASK_REPOSITORY_TOKEN } from '@domain/repositories/task/task.repository';

import { CreateTaskUseCase } from '../create-task.use-case';

describe('Use Cases -> Task -> Create', () => {
  let createTaskUseCase: CreateTaskUseCase;

  const user = new UserMock();
  const resource = new ResourceMock({ type: ResourceType.TASK, userId: user.id });
  const task = new TaskMock({ resourceId: resource.id });

  const resourceRepositoryMock = {
    create: jest.fn()
  };

  const taskRepositoryMock = {
    create: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateTaskUseCase,
        {
          provide: RESOURCE_REPOSITORY_TOKEN,
          useValue: resourceRepositoryMock
        },
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: taskRepositoryMock
        }
      ]
    }).compile();

    createTaskUseCase = module.get<CreateTaskUseCase>(CreateTaskUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should create task with resource', async () => {
    resourceRepositoryMock.create.mockResolvedValue(resource);
    taskRepositoryMock.create.mockResolvedValue(task);

    const input = {
      data: {
        name: task.name,
        description: task.description,
        status: task.status,
        startDate: task.startDate,
        endDate: task.endDate
      },
      userId: user.id
    };

    const result = await createTaskUseCase.execute(input);

    expect(resourceRepositoryMock.create).toHaveBeenCalledWith({
      type: ResourceType.TASK,
      userId: user.id
    });
    expect(taskRepositoryMock.create).toHaveBeenCalledWith({
      ...input.data,
      resource
    });
    expect(result).toEqual(task);
  });

  it('should not create task - invalid date range (startDate >= endDate)', async () => {
    const invalidStartDate = new Date('2024-01-20');
    const invalidEndDate = new Date('2024-01-15');

    const input = {
      data: {
        name: task.name,
        description: task.description,
        status: task.status,
        startDate: invalidStartDate,
        endDate: invalidEndDate
      },
      userId: user.id
    };

    await expect(createTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.INVALID_DATE_RANGE));
    expect(resourceRepositoryMock.create).not.toHaveBeenCalled();
    expect(taskRepositoryMock.create).not.toHaveBeenCalled();
  });

  it('should not create task - invalid date range (equal dates)', async () => {
    const sameDate = new Date('2024-01-15');

    const input = {
      data: {
        name: task.name,
        description: task.description,
        status: task.status,
        startDate: sameDate,
        endDate: sameDate
      },
      userId: user.id
    };

    await expect(createTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.INVALID_DATE_RANGE));
    expect(resourceRepositoryMock.create).not.toHaveBeenCalled();
    expect(taskRepositoryMock.create).not.toHaveBeenCalled();
  });
});
