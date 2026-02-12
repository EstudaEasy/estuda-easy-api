import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskModel } from '@database/typeorm/models/task/task.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';

import { TaskRepository } from '../task.repository';

describe('TypeOrm -> Task Repository -> Find', () => {
  const taskMocks = TaskMock.getList(3);

  let taskRepository: TaskRepository;
  let taskRepositoryMock: Repository<TaskModel>;
  let findAndCountSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(TaskModel),
          useValue: {
            findAndCount: jest.fn()
          }
        }
      ]
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    taskRepositoryMock = module.get<Repository<TaskModel>>(getRepositoryToken(TaskModel));

    findAndCountSpy = jest.spyOn(taskRepositoryMock, 'findAndCount');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return tasks with count', async () => {
    findAndCountSpy.mockResolvedValue([taskMocks, taskMocks.length]);

    const res = await taskRepository.find();

    expect(res).toEqual({ tasks: taskMocks, total: 3 });
    expect(res.tasks).toHaveLength(3);
    expect(res.total).toBe(3);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });

  it('should return empty array when no tasks found', async () => {
    findAndCountSpy.mockResolvedValue([[], 0]);

    const res = await taskRepository.find();

    expect(res).toEqual({ tasks: [], total: 0 });
    expect(res.tasks).toHaveLength(0);
    expect(res.total).toBe(0);
    expect(findAndCountSpy).toHaveBeenCalledTimes(1);
  });
});
