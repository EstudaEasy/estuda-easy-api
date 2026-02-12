import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { TaskModel } from '@database/typeorm/models/task/task.model';
import { TypeOrmUtilsService } from '@database/typeorm/utils/typeorm-utils.service';
import { TaskMock } from '@domain/entities/task/__mocks__/task.mock';

import { TaskRepository } from '../task.repository';

describe('TypeOrm -> Task Repository -> Create', () => {
  const taskMock = new TaskMock();

  let taskRepository: TaskRepository;
  let taskRepositoryMock: Repository<TaskModel>;
  let createSpy: jest.SpyInstance;
  let saveSpy: jest.SpyInstance;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TaskRepository,
        TypeOrmUtilsService,
        {
          provide: getRepositoryToken(TaskModel),
          useValue: {
            create: jest.fn(),
            save: jest.fn()
          }
        }
      ]
    }).compile();

    taskRepository = module.get<TaskRepository>(TaskRepository);
    taskRepositoryMock = module.get<Repository<TaskModel>>(getRepositoryToken(TaskModel));

    createSpy = jest.spyOn(taskRepositoryMock, 'create');
    createSpy.mockReturnValue(taskMock);

    saveSpy = jest.spyOn(taskRepositoryMock, 'save');
    saveSpy.mockResolvedValue(taskMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should create and return a task', async () => {
    const res = await taskRepository.create({
      name: taskMock.name,
      description: taskMock.description,
      status: taskMock.status,
      startDate: taskMock.startDate,
      endDate: taskMock.endDate
    });

    expect(res).toStrictEqual(taskMock);
    expect(createSpy).toHaveBeenCalledTimes(1);
    expect(saveSpy).toHaveBeenCalledTimes(1);
  });
});
