import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

import { TaskModel } from '@database/typeorm/models/task/task.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';

import { TaskRepository } from '../task.repository';

describe('TypeOrm -> Task Repository -> Update', () => {
  const taskMock = new TaskMock();

  let taskRepository: TaskRepository;
  let taskRepositoryMock: Repository<TaskModel>;
  let updateSpy: jest.SpyInstance;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(TaskModel),
          useValue: {
            update: jest.fn(),
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    taskRepositoryMock = module.get<Repository<TaskModel>>(getRepositoryToken(TaskModel));

    updateSpy = jest.spyOn(taskRepositoryMock, 'update');
    findOneSpy = jest.spyOn(taskRepositoryMock, 'findOne');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should update and return a task - task updated', async () => {
    updateSpy.mockResolvedValue({ affected: 1 } as UpdateResult);
    findOneSpy.mockResolvedValue(taskMock);

    const res = await taskRepository.update({ id: taskMock.id }, { name: 'Updated Task' });

    expect(res).toStrictEqual(taskMock);
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - task not found', async () => {
    updateSpy.mockResolvedValue({ affected: 0 } as UpdateResult);

    const res = await taskRepository.update({ id: taskMock.id }, { name: 'Updated Task' });

    expect(res).toBeNull();
    expect(updateSpy).toHaveBeenCalledTimes(1);
    expect(findOneSpy).not.toHaveBeenCalled();
  });
});
