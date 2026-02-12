import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  SerializeOptions,
  UseInterceptors
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiOkResponse,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiNoContentResponse
} from '@nestjs/swagger';

import { CreateTaskUseCase } from '@application/use-cases/task/create-task.use-case';
import { DeleteTaskUseCase } from '@application/use-cases/task/delete-task.use-case';
import { FindOneTaskUseCase } from '@application/use-cases/task/find-one-task.use-case';
import { FindTasksUseCase } from '@application/use-cases/task/find-tasks.use-case';
import { UpdateTaskUseCase } from '@application/use-cases/task/update-task.use-case';
import { SharePermission } from '@domain/entities/resource-share/resource-share.interface';
import { Auth } from '@presentation/http/decorators/auth.decorator';
import { ResourcePermission } from '@presentation/http/decorators/resource-permission.decorator';
import { User } from '@presentation/http/decorators/user.decorator';

import {
  CreateTaskBodyDTO,
  FindOneTaskParamsDTO,
  UpdateTaskParamsDTO,
  DeleteTaskParamsDTO,
  TaskResponseDTO,
  FindTaskQueryDTO,
  FindTaskResponseDTO,
  UpdateTaskBodyDTO
} from '../../dtos/task';

@Auth()
@ApiTags('Tarefas')
@Controller('tasks')
@UseInterceptors(ClassSerializerInterceptor)
export class TaskController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly findOneTaskUseCase: FindOneTaskUseCase,
    private readonly findTasksUseCase: FindTasksUseCase,
    private readonly updateTaskUseCase: UpdateTaskUseCase,
    private readonly deleteTaskUseCase: DeleteTaskUseCase
  ) {}

  @Post()
  @SerializeOptions({ type: TaskResponseDTO })
  @ApiOperation({ summary: 'Criar uma nova tarefa' })
  @ApiCreatedResponse({ description: 'Tarefa criada com sucesso', type: TaskResponseDTO })
  async create(@User('id') userId: number, @Body() data: CreateTaskBodyDTO): Promise<TaskResponseDTO> {
    return await this.createTaskUseCase.execute({ data, userId });
  }

  @Get()
  @SerializeOptions({ type: FindTaskResponseDTO })
  @ApiOperation({ summary: 'Buscar tarefas' })
  @ApiOkResponse({ description: 'Tarefas retornadas com sucesso', type: FindTaskResponseDTO })
  async find(@User('id') userId: number, @Query() filters: FindTaskQueryDTO): Promise<FindTaskResponseDTO> {
    return await this.findTasksUseCase.execute({
      filters: { ...filters, resource: { userId } },
      relations: { resource: true }
    });
  }

  @Get('shared')
  @SerializeOptions({ type: FindTaskResponseDTO })
  @ApiOperation({ summary: 'Buscar tarefas compartilhadas com o usuário' })
  @ApiOkResponse({ description: 'Tarefas retornadas com sucesso', type: FindTaskResponseDTO })
  async findShared(@User('id') userId: number, @Query() filters: FindTaskQueryDTO): Promise<FindTaskResponseDTO> {
    return await this.findTasksUseCase.execute({
      filters: { ...filters, resource: { shares: { userId } } },
      relations: { resource: true }
    });
  }

  @Get(':taskId')
  @SerializeOptions({ type: TaskResponseDTO })
  @ApiOperation({ summary: 'Buscar uma tarefa por ID' })
  @ApiOkResponse({ description: 'Tarefa encontrada', type: TaskResponseDTO })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  async findOne(@Param() params: FindOneTaskParamsDTO): Promise<TaskResponseDTO> {
    return await this.findOneTaskUseCase.execute({
      filters: { id: params.taskId },
      relations: { resource: true }
    });
  }

  @Patch(':taskId')
  @ResourcePermission([SharePermission.EDIT, SharePermission.ADMIN], 'taskId')
  @SerializeOptions({ type: TaskResponseDTO })
  @ApiOperation({ summary: 'Atualizar uma tarefa' })
  @ApiOkResponse({ description: 'Tarefa atualizada com sucesso', type: TaskResponseDTO })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  async update(@Param() params: UpdateTaskParamsDTO, @Body() data: UpdateTaskBodyDTO): Promise<TaskResponseDTO> {
    return await this.updateTaskUseCase.execute({ filters: { id: params.taskId }, data });
  }

  @Delete(':taskId')
  @ResourcePermission([], 'taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Deletar uma tarefa' })
  @ApiNoContentResponse({ description: 'Tarefa deletada com sucesso' })
  @ApiNotFoundResponse({ description: 'Tarefa não encontrada' })
  async delete(@Param() params: DeleteTaskParamsDTO): Promise<void> {
    return await this.deleteTaskUseCase.execute({ filters: { id: params.taskId } });
  }
}
