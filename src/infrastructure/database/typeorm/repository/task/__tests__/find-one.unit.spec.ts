import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskModel } from '@database/typeorm/models/task/task.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';

import { TaskRepository } from '../task.repository';

describe('TypeOrm -> Task Repository -> Find One', () => {
  const taskMock = new TaskMock();

  let taskRepository: TaskRepository;
  let taskRepositoryMock: Repository<TaskModel>;
  let findOneSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(TaskModel),
          useValue: {
            findOne: jest.fn()
          }
        }
      ]
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    taskRepositoryMock = module.get<Repository<TaskModel>>(getRepositoryToken(TaskModel));

    findOneSpy = jest.spyOn(taskRepositoryMock, 'findOne');
    findOneSpy.mockResolvedValue(taskMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should find and return a task - task found', async () => {
    const res = await taskRepository.findOne({ id: taskMock.id });

    expect(res).toStrictEqual(taskMock);
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });

  it('should return null - task not found', async () => {
    findOneSpy.mockResolvedValueOnce(null);

    const res = await taskRepository.findOne({ id: taskMock.id });

    expect(res).toBeNull();
    expect(findOneSpy).toHaveBeenCalledTimes(1);
  });
});
