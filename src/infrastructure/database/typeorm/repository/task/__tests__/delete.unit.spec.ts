import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';

import { TaskModel } from '@database/typeorm/models/task/task.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';

import { TaskRepository } from '../task.repository';

describe('TypeOrm -> Task Repository -> Delete', () => {
  const taskMock = new TaskMock();

  let taskRepository: TaskRepository;
  let taskRepositoryMock: Repository<TaskModel>;
  let deleteSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(TaskModel),
          useValue: {
            delete: jest.fn()
          }
        }
      ]
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    taskRepositoryMock = module.get<Repository<TaskModel>>(getRepositoryToken(TaskModel));

    deleteSpy = jest.spyOn(taskRepositoryMock, 'delete');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should delete a task and return true - task found', async () => {
    deleteSpy.mockResolvedValue({ affected: 1 } as DeleteResult);

    const res = await taskRepository.delete({ id: taskMock.id });

    expect(res).toBe(true);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });

  it('should return false - task not found', async () => {
    deleteSpy.mockResolvedValue({ affected: 0 } as DeleteResult);

    const res = await taskRepository.delete({ id: taskMock.id });

    expect(res).toBe(false);
    expect(deleteSpy).toHaveBeenCalledTimes(1);
  });
});
