import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsUUID, IsEnum, Length } from 'class-validator';

import { TaskStatus } from '@domain/entities/task/task.interface';

import { TaskResponseDTO } from './task-response.dto';

export class FindTaskQueryDTO {
  @ApiPropertyOptional({
    description: 'ID da tarefa',
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsOptional()
  @IsUUID()
  id?: string;

  @ApiPropertyOptional({
    description: 'Nome da tarefa',
    example: 'Estudar matemática',
    minLength: 3,
    maxLength: 100
  })
  @IsOptional()
  @IsString()
  @Length(3, 100)
  name?: string;

  @ApiPropertyOptional({
    description: 'Status da tarefa',
    enum: TaskStatus,
    example: TaskStatus.PENDING
  })
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;
}

export class FindTaskResponseDTO {
  @ApiProperty({ description: 'Lista de tarefas', type: [TaskResponseDTO] })
  @Type(() => TaskResponseDTO)
  tasks: TaskResponseDTO[];

  @ApiProperty({ description: 'Total de tarefas encontradas', example: 10 })
  total: number;
}
