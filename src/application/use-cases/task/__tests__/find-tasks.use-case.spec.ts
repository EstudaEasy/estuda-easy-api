import { Test } from '@nestjs/testing';

import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';
import { TASK_REPOSITORY_TOKEN } from '@domain/repositories/task/task.repository';

import { FindTasksUseCase } from '../find-tasks.use-case';

describe('Use Cases -> Task -> Find', () => {
  let findTasksUseCase: FindTasksUseCase;

  const tasks = TaskMock.getList(2);
  const total = tasks.length;

  const taskRepositoryMock = {
    find: jest.fn()
  };

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        FindTasksUseCase,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useValue: taskRepositoryMock
        }
      ]
    }).compile();

    findTasksUseCase = module.get<FindTasksUseCase>(FindTasksUseCase);
  });

  afterEach(() => jest.clearAllMocks());

  it('should find tasks', async () => {
    taskRepositoryMock.find.mockResolvedValue({ tasks, total });

    const input = {
      filters: {},
      relations: { resource: true }
    };

    const result = await findTasksUseCase.execute(input);

    expect(taskRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.tasks).toEqual(tasks);
    expect(result.total).toBe(total);
  });

  it('should find tasks with filters', async () => {
    const filteredTasks = [tasks[0]];
    taskRepositoryMock.find.mockResolvedValue({ tasks: filteredTasks, total: 1 });

    const input = {
      filters: { name: tasks[0].name },
      relations: { resource: true }
    };

    const result = await findTasksUseCase.execute(input);

    expect(taskRepositoryMock.find).toHaveBeenCalledWith(input.filters, input.relations);
    expect(result.tasks).toEqual(filteredTasks);
    expect(result.total).toBe(1);
  });
});
