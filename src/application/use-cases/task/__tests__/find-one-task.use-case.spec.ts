import { Test } from '@nestjs/testing';

import { TaskErrorCodes, Exception } from '@application/errors';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';
import { TASK_REPOSITORY_TOKEN } from '@domain/repositories/task/task.repository';

import { FindOneTaskUseCase } from '../find-one-task.use-case';

describe('Use Cases -> Task -> Find One', () => {
  let findOneTaskUseCase: FindOneTaskUseCase;

  const task = new TaskMock();

  const taskRepositoryMock = {
    findOne: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindOneTaskUseCase,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: taskRepositoryMock
        }
      ]
    }).compile();

    findOneTaskUseCase = module.get<FindOneTaskUseCase>(FindOneTaskUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find one task', async () => {
    taskRepositoryMock.findOne.mockResolvedValue(task);

    const input = {
      filters: { id: task.id },
      relations: { resource: true }
    };

    const result = await findOneTaskUseCase.execute(input);

    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result).toEqual(task);
  });

  it('should not find task - task not found', async () => {
    taskRepositoryMock.findOne.mockResolvedValue(null);

    const input = {
      filters: { id: task.id }
    };

    await expect(findOneTaskUseCase.execute(input)).rejects.toThrow(new Exception(TaskErrorCodes.NOT_FOUND));
    expect(taskRepositoryMock.findOne).toHaveBeenCalledWith(input.filters, undefined);
  });
});
